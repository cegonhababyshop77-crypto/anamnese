
import React, { useState } from 'react';
import { AnamneseData } from '../types';
import { getAnamneses } from '../services/storage';
import { Search, Download, ChevronRight, ArrowLeft, Filter, Trash2 } from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBack }) => {
  const [data, setData] = useState<AnamneseData[]>(getAnamneses());
  const [selectedItem, setSelectedItem] = useState<AnamneseData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredData = data
    .filter(item => item.identificacao.nome.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  const downloadPDF = (item: AnamneseData) => {
    // Simple simulation of PDF download as a TXT format for the prototype
    // In a real environment, we'd use jspdf
    const content = `
FICHA DE ANAMNESE - MÉTODO A.C.H.E.S.E.
---------------------------------------
Identificação:
Nome: ${item.identificacao.nome}
Idade: ${item.identificacao.idade}
Data: ${item.identificacao.data}
Contato: ${item.identificacao.contato}
Estado Civil: ${item.identificacao.estadoCivil}
Profissão: ${item.identificacao.profissao}

Contexto Geral: ${item.respostas.contextoGeral}
Rotina/Autoimagem: ${item.respostas.rotinaAutoimagem}
Saúde: ${item.respostas.saudeFisicaMental}
Rede de Apoio: ${item.respostas.redeApoio}
Propósitos: ${item.respostas.propositosValores}
Estresse: ${item.respostas.estresseDesafios}
Espiritualidade: ${item.respostas.espiritualidadeFe}
Expectativas: ${item.respostas.expectativas}

Assinado em: ${new Date(item.timestamp).toLocaleString()}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ficha_${item.identificacao.nome.replace(/\s/g, '_')}.txt`;
    link.click();
  };

  if (selectedItem) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <button 
          onClick={() => setSelectedItem(null)}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft size={18} /> Voltar para a lista
        </button>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-10 border border-gray-100">
          <div className="flex justify-between items-start mb-10 border-b pb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">{selectedItem.identificacao.nome}</h1>
              <p className="text-gray-500 mt-1">Ficha preenchida em {new Date(selectedItem.timestamp).toLocaleString()}</p>
            </div>
            <button 
              onClick={() => downloadPDF(selectedItem)}
              className="gradient-btn px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm text-sm"
            >
              <Download size={16} /> Baixar PDF
            </button>
          </div>

          <div className="space-y-10">
            <section>
              <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-4 border-l-4 border-primary pl-3">Identificação</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <p><strong>Nome Completo:</strong> {selectedItem.identificacao.nome}</p>
                <p><strong>Idade:</strong> {selectedItem.identificacao.idade}</p>
                <p><strong>Contato:</strong> {selectedItem.identificacao.contato}</p>
                <p><strong>Estado Civil:</strong> {selectedItem.identificacao.estadoCivil}</p>
                <p><strong>Profissão:</strong> {selectedItem.identificacao.profissao}</p>
                <p><strong>Data da Ficha:</strong> {selectedItem.identificacao.data}</p>
              </div>
            </section>

            {[
              { title: 'Contexto Geral e Histórico Pessoal', text: selectedItem.respostas.contextoGeral },
              { title: 'Rotina Atual e Autoimagem', text: selectedItem.respostas.rotinaAutoimagem },
              { title: 'Saúde Física e Mental', text: selectedItem.respostas.saudeFisicaMental },
              { title: 'Rede de Apoio e Relacionamentos', text: selectedItem.respostas.redeApoio },
              { title: 'Propósitos e Valores', text: selectedItem.respostas.propositosValores },
              { title: 'Estresse e Desafios', text: selectedItem.respostas.estresseDesafios },
              { title: 'Espiritualidade e Fé', text: selectedItem.respostas.espiritualidadeFe },
              { title: 'Expectativas para o Processo Terapêutico', text: selectedItem.respostas.expectativas }
            ].map((section, idx) => (
              <section key={idx}>
                <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-3 border-l-4 border-primary pl-3">{section.title}</h3>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-lg">{section.text || 'Nenhuma resposta fornecida.'}</p>
              </section>
            ))}

            <section className="pt-6 border-t">
               <h3 className="text-primary font-bold uppercase tracking-wider text-sm mb-4">Assinatura Digital</h3>
               <div className="bg-gray-50 p-4 rounded-lg inline-block border border-gray-200">
                  <img src={selectedItem.assinatura} alt="Assinatura" className="max-h-24 grayscale" />
               </div>
               <p className="text-xs text-gray-400 mt-2">ID do documento: {selectedItem.id}</p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">Painel do Administrador</h1>
          <p className="text-gray-500">Gerenciamento de fichas de anamnese</p>
        </div>
        <button 
          onClick={onBack}
          className="text-gray-600 hover:text-primary transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Sair do Painel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-sm"
            >
              <Filter size={16} /> Data {sortOrder === 'asc' ? 'Antigas' : 'Recentes'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="px-6 py-4">Nome do Paciente</th>
                <th className="px-6 py-4">Data de Envio</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.identificacao.nome}</div>
                    <div className="text-xs text-gray-500">{item.identificacao.idade} anos • {item.identificacao.profissao}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.timestamp).toLocaleDateString()}
                    <div className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.identificacao.contato}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => downloadPDF(item)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Baixar TXT"
                      >
                        <Download size={18} />
                      </button>
                      <button 
                        onClick={() => setSelectedItem(item)}
                        className="p-2 text-gray-400 hover:text-primary transition-colors"
                        title="Ver detalhes"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    Nenhuma ficha encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t text-xs text-gray-400 text-center">
          Total de {filteredData.length} fichas registradas
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
