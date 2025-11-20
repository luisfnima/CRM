import PlaceholderPage from '../../../components/common/PlaceholderPage';
import { Clock } from 'lucide-react';

const AgentWithoutSelling = () => {
  return (
    <PlaceholderPage 
      title="Tiempo sin Vender"
      description="Agentes sin ventas"
      icon={Clock}
    />
  );
};

export default AgentWithoutSelling;
