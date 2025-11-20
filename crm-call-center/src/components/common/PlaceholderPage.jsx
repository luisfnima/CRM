import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description, icon: Icon }) => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          {Icon && <Icon className="w-8 h-8 text-blue-600" />}
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Construction className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Módulo en Construcción
          </h3>
          <p className="text-gray-500 max-w-md">
            Esta página estará disponible próximamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
