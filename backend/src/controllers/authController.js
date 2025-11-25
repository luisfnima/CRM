import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required'});
        }

        const emailParts = email.split('@');
        if(emailParts.lenght !== 2) {
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

        const isPasswordValid = await bcrpyt.compare(password, user.password);
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
        
        
    }
}