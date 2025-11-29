import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

const prisma = new PrismaClient();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        const emailParts = email.includes('@') ? email.split('@') : [email, null];
        if(!emailParts[1]) {
            return res.status(400).json({ error: 'Invalid email format'});
        }

        
        const userEmail = emailParts[0];
        const domain = '@' + emailParts[1];

        const company = await prisma.companies.findUnique({
            where: { domain }
        });

        if( !company || !company.active ) {
            return res.status(401).json({ error: 'Invalid credentials or inactive company'});
        }
        
        const user = await prisma.users.findUnique({
            where: {
                company_id_email: {
                    company_id: company.id,
                    email: userEmail
                }
            },
            include: {
                role: true,
                branch: true,
                schedule: true
            }
        });

        if( !user || user.status !== 'active') {
            return res.status(401).json({error: 'Invalid credentials or inactive user'});
        }


        console.log('password ingresado: ', password);
        console.log('password de BBDD: ', user.password);
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('valido?', isPasswordValid);
        if(!isPasswordValid) {
            return res.status(401).json({error: 'Invalid credentials'});
        }

        await prisma.users.update({
            where: {id: user.id},
            data: {last_access: new Date()}
        });

        const token = generateToken({
            userId: user.id,
            companyId: company.id,
            roleId: user.role_id
        });

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            token, 
            user: {
                ...userWithoutPassword,
                full_email: `${user.email}${company.domain}`
            },
            company: {
                id: company.id,
                name: company.name,
                domain: company.domain,
                primary_color: company.primary_color,
                secondary_color: company.secondary_color,
                logo_url: company.logo_url
            }
        });
    } catch (error) {
        console.error('Login error', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const register = async (req, res) => {
    try{
        const {company_id, name, email, password, role_id, branch_id, schedule_id} = req.body;
        
        if(!company_id || !name || !email || !password){
            return res.status(400).json({ error: 'Missing required fields'});
        }
        
        const existingUser = await prisma.users.findUnique({
            where: {
                company_id_email: {
                    company_id,
                    email
                }
            }
        });

        if (existingUser) {
            return res.status(409).json({error: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await prisma.useres.create({
            data: {
                company_id,
                name,
                email,
                password: hashedPassword,
                role_id,
                branch_id,
                schedule_id
            },
            include: {
                role: true,
                branch: true,
                schedule: true,
                company: true
            }
        });

        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
            message: 'User created succesfully',
            user: userWithoutPassword
        });

    } catch ( error ){
        console.error('Error', error);
        res.status(500).json({error: 'Internal server error'});
    }
};

export const getMe = async (req, res) => {
    try{
        const userId = req.user.userId;

        const user = await prisma.users.findUnique({
            where: {id: userId},
            include: {
                role: true,
                branch: true,
                schedule: true,
                company:true
            }
        });

        if( !user ) {
            return res.status(404).json({error: 'User not found'});
        }

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: {
                ...userWithoutPassword,
                full_email: `${user.email}${user.company.domain}`
            },
            company: {
                id: user.company.id,
                name: user.company.name,
                domaun: user.company.name,
                domain: user.company.domain,
                primary_color: user.company.primary_color,
                secondary_color: user.company.secondary_color,
                logo_url: user.company.logo_url
            }
        });
    } catch (error) {
        console.error('GetMe error', error);
        res.status(500).json({error: 'Internal server error'});
    }
}