
export interface AnamneseData {
  id: string;
  timestamp: string;
  identificacao: {
    data: string;
    nome: string;
    idade: string;
    contato: string;
    estadoCivil: string;
    profissao: string;
  };
  respostas: {
    contextoGeral: string;
    rotinaAutoimagem: string;
    saudeFisicaMental: string;
    redeApoio: string;
    propositosValores: string;
    estresseDesafios: string;
    espiritualidadeFe: string;
    expectativas: string;
  };
  assinatura: string; // Base64 data URL
  termoAceito: boolean;
}

export type ViewState = 'FORM' | 'LOGIN' | 'ADMIN' | 'SUCCESS';
