type Question = {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'number' | 'select' | 'radio' | 'file';
  required: boolean;
  help: string;
  options?: string[];
};

export const NEW_WIZARD_QUESTIONS: Question[] = [
  {
    id: 'company_value',
    label: 'Vad gör företaget och vilket värde skapar det?',
    type: 'textarea',
    required: true,
    help: 'Beskriv affärsidén, produkten/tjänsten, kundpain och hur ni skapar värde.'
  },
  {
    id: 'customer_problem',
    label: 'Vilket problem löser ni för era kunder?',
    type: 'textarea',
    required: true,
    help: 'Beskriv det specifika problem eller behov som er produkt/tjänst adresserar.'
  }
]; 