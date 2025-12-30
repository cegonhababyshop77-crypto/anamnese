
import React, { useState, useEffect } from 'react';
import { Settings, CheckCircle2, Send, Download, LogIn, ClipboardList } from 'lucide-react';
import { AnamneseData, ViewState } from './types';
import { saveAnamnese } from './services/storage';
import AdminPanel from './components/AdminPanel';
import SignaturePad from './components/SignaturePad';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('FORM');
  const [loading, setLoading] = useState(false);
  
  // Admin Login States
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Form States
  const [formData, setFormData] = useState({
    identificacao: {
      data: new Date().toISOString().split('T')[0],
      nome: '',
      idade: '',
      contato: '',
      estadoCivil: '',
      profissao: ''
    },
    respostas: {
      contextoGeral: '',
      rotinaAutoimagem: '',
      saudeFisicaMental: '',
      redeApoio: '',
      propositosValores: '',
      estresseDesafios: '',
      espiritualidadeFe: '',
      expectativas: ''
    },
    assinatura: '',
    termoAceito: false
  });

  const handleInputChange = (section: 'identificacao' | 'respostas', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Corrigido de 'clinete321' para 'cliente321' conforme solicitado
    if (adminUser === 'cliente123' && adminPass === 'cliente321') {
      setView('ADMIN');
      setLoginError('');
    } else {
      setLoginError('Credenciais inválidas.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assinatura) {
      alert('A assinatura digital é obrigatória.');
      return;
    }
    if (!formData.termoAceito) {
      alert('Você deve aceitar o Termo de Responsabilidade.');
      return;
    }

    setLoading(true);
    
    const submission: AnamneseData = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      ...formData
    };

    // Simulate API delay
    setTimeout(() => {
      saveAnamnese(submission);
      setLoading(false);
      setView('SUCCESS');
    }, 1500);
  };

  const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-12 bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-serif font-bold text-primary mb-6 border-b pb-4 flex items-center gap-3 uppercase tracking-wide">
        <span className="w-2 h-6 bg-primary rounded-full"></span>
        {title}
      </h2>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );

  const InputField: React.FC<{ 
    label: string; 
    type?: string; 
    required?: boolean; 
    placeholder?: string;
    section: 'identificacao' | 'respostas';
    field: string;
    isTextArea?: boolean;
  }> = ({ label, type = 'text', required, placeholder, section, field, isTextArea }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {isTextArea ? (
        <textarea
          required={required}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-gray-900"
          value={(formData[section] as any)[field]}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-gray-900"
          value={(formData[section] as any)[field]}
          onChange={(e) => handleInputChange(section, field, e.target.value)}
        />
      )}
    </div>
  );

  if (view === 'ADMIN') {
    return <AdminPanel onBack={() => setView('FORM')} />;
  }

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block p-4 rounded-full bg-primary/10 text-primary mb-4">
              <LogIn size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-primary">Login Administrativo</h2>
            <p className="text-gray-500 text-sm">Acesse as fichas de seus pacientes</p>
          </div>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
              />
            </div>
            {loginError && <p className="text-red-500 text-xs italic">{loginError}</p>}
            <button 
              type="submit"
              className="w-full py-3 rounded-lg bg-primary text-white font-bold hover:bg-opacity-90 transition-all shadow-md mt-4"
            >
              Entrar
            </button>
          </form>
          <button 
            onClick={() => setView('FORM')}
            className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm"
          >
            Voltar para o formulário
          </button>
        </div>
      </div>
    );
  }

  if (view === 'SUCCESS') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white">
        <div className="max-w-lg w-full text-center">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full">
            <CheckCircle2 size={60} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-4">Ficha Enviada com Sucesso!</h1>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg">
            Gratidão pela confiança. Suas informações foram registradas com segurança e serão utilizadas exclusivamente para o seu processo terapêutico.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="gradient-btn px-8 py-3 rounded-full font-bold shadow-lg inline-flex items-center gap-2"
          >
            Preencher nova ficha
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Settings Gear for Admin Login */}
      <button 
        onClick={() => setView('LOGIN')}
        className="fixed top-6 right-6 p-2 rounded-full bg-white shadow-md text-gray-400 hover:text-primary transition-all z-50 border border-gray-100"
        title="Área do Terapeuta"
      >
        <Settings size={24} />
      </button>

      {/* Header */}
      <header className="bg-white border-b border-gray-100 pt-16 pb-12 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block p-4 rounded-2xl bg-primary/5 text-primary mb-6">
            <ClipboardList size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Anamnese Terapêutica</h1>
          <p className="text-gray-500 max-w-2xl mx-auto italic">
            "Sua jornada de autodescoberta começa aqui. O Método A.C.H.E.S.E. nos ajuda a entender sua essência para traçar o melhor caminho."
          </p>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-4xl mx-auto px-4 mt-12">
        <form onSubmit={handleSubmit}>
          <FormSection title="Identificação">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField label="Data" type="date" section="identificacao" field="data" required />
              <InputField label="Nome Completo" placeholder="Seu nome completo" section="identificacao" field="nome" required />
              <InputField label="Idade" type="number" placeholder="Ex: 35" section="identificacao" field="idade" required />
              <InputField label="Contato (WhatsApp / E-mail)" placeholder="(00) 00000-0000" section="identificacao" field="contato" required />
              <InputField label="Estado Civil" placeholder="Solteiro(a), Casado(a)..." section="identificacao" field="estadoCivil" />
              <InputField label="Profissão" placeholder="Sua ocupação principal" section="identificacao" field="profissao" />
            </div>
          </FormSection>

          <FormSection title="Contexto Geral e Histórico Pessoal">
            <InputField 
              label="Fale um pouco sobre sua história de vida e o que o(a) trouxe à terapia hoje." 
              isTextArea 
              section="respostas" 
              field="contextoGeral" 
              required
            />
          </FormSection>

          <FormSection title="Rotina Atual e Autoimagem">
            <InputField 
              label="Como é o seu dia a dia? E como você se percebe fisicamente e emocionalmente?" 
              isTextArea 
              section="respostas" 
              field="rotinaAutoimagem" 
              required
            />
          </FormSection>

          <FormSection title="Saúde Física e Mental">
            <InputField 
              label="Histórico de doenças, uso de medicamentos, qualidade do sono e hábitos de saúde." 
              isTextArea 
              section="respostas" 
              field="saudeFisicaMental" 
              required
            />
          </FormSection>

          <FormSection title="Rede de Apoio e Relacionamentos">
            <InputField 
              label="Com quem você conta em momentos difíceis? Como são suas relações familiares e sociais?" 
              isTextArea 
              section="respostas" 
              field="redeApoio" 
              required
            />
          </FormSection>

          <FormSection title="Propósitos e Valores">
            <InputField 
              label="O que é realmente importante para você? Quais são seus sonhos e valores fundamentais?" 
              isTextArea 
              section="respostas" 
              field="propositosValores" 
              required
            />
          </FormSection>

          <FormSection title="Estresse e Desafios">
            <InputField 
              label="Quais são as principais fontes de estresse ou dificuldades que você enfrenta atualmente?" 
              isTextArea 
              section="respostas" 
              field="estresseDesafios" 
              required
            />
          </FormSection>

          <FormSection title="Espiritualidade e Fé">
            <InputField 
              label="Você possui alguma prática espiritual ou fé? Como isso influencia sua vida?" 
              isTextArea 
              section="respostas" 
              field="espiritualidadeFe" 
              required
            />
          </FormSection>

          <FormSection title="Expectativas para o Processo Terapêutico">
            <InputField 
              label="O que você espera alcançar ao final deste processo terapêutico?" 
              isTextArea 
              section="respostas" 
              field="expectativas" 
              required
            />
          </FormSection>

          {/* Legal and Signature */}
          <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8 shadow-sm mb-12">
            <h2 className="text-xl font-serif font-bold text-primary mb-6 border-b pb-4 flex items-center gap-3 uppercase tracking-wide">
              <span className="w-2 h-6 bg-primary rounded-full"></span>
              Conclusão e Aceite
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-sm text-gray-700 leading-relaxed border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Termo de Responsabilidade</h4>
              <p className="mb-4">
                Declaro, para os devidos fins, que:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Consinto livremente com o fornecimento das informações acima para fins terapêuticos.</li>
                <li>Autorizo o armazenamento seguro destes dados sob responsabilidade do profissional.</li>
                <li>Estou ciente de que o atendimento terapêutico não substitui acompanhamento médico especializado.</li>
                <li>Todas as informações fornecidas são verdadeiras e refletem minha realidade atual.</li>
              </ul>
              
              <div className="mt-6 flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="termo" 
                  required
                  className="mt-1 w-5 h-5 accent-primary cursor-pointer"
                  checked={formData.termoAceito}
                  onChange={(e) => setFormData(prev => ({ ...prev, termoAceito: e.target.checked }))}
                />
                <label htmlFor="termo" className="text-sm font-medium cursor-pointer">
                  Li e aceito os termos de responsabilidade e autorizo o processamento dos meus dados.
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Assinatura Digital (use o mouse ou o dedo)</label>
              <SignaturePad 
                onSave={(data) => setFormData(prev => ({ ...prev, assinatura: data }))}
                onClear={() => setFormData(prev => ({ ...prev, assinatura: '' }))}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-xl hover:bg-opacity-90 transform hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="animate-pulse">Enviando...</span>
              ) : (
                <>
                  <Send size={20} /> Enviar Ficha
                </>
              )}
            </button>
            
            <button 
              type="button"
              onClick={() => window.print()}
              className="w-full md:w-auto px-10 py-4 gradient-btn rounded-full font-bold text-lg shadow-md flex items-center justify-center gap-3"
            >
              <Download size={20} /> Baixar PDF
            </button>
          </div>
        </form>
      </main>

      <footer className="mt-20 py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} - Sistema de Anamnese Digital Médoto A.C.H.E.S.E.</p>
        <p className="mt-1">Ambiente seguro e criptografado</p>
      </footer>
    </div>
  );
};

export default App;
