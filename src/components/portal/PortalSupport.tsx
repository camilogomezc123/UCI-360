import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EducationResource } from '../../types';
import {
  MessageCircle,
  BookOpen,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronRight
} from 'lucide-react';

export const PortalSupport: React.FC = () => {
  const {
    supportRequests,
    submitSupportRequest,
    education,
    markEducationRead,
    easyMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'support' | 'education'>('support');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEdu, setSelectedEdu] = useState<EducationResource | null>(null);

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    submitSupportRequest(subject, message);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'support'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Preguntar al Equipo Clínico ({supportRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'education'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Biblioteca Educativa ({education.length})</span>
        </button>
      </div>

      {activeTab === 'support' ? (
        <div className="space-y-6">
          {/* New Question Form */}
          <form
            onSubmit={handleSubmitQuestion}
            className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
          >
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-sky-600" />
              <span>Enviar Inquietud o Pregunta a la Línea de Apoyo PosUCI</span>
            </h4>
            <p className="text-xs text-slate-500">
              Respuestas directas del equipo interdisciplinario (médico, enfermería, fisioterapia, nutrición). No reemplaza el servicio de urgencias ante un evento crítico.
            </p>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Asunto / Tema</label>
              <input
                type="text"
                required
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="Ej. Duda sobre horarios del inhalador / mareo leve al despertar"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Describe tu duda detalladamente</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe aquí con tranquilidad lo que necesitas saber..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> +10 XP
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar Pregunta</span>
              </button>
            </div>
          </form>

          {/* Past Inquiries */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Tus Solicitudes Anteriores
            </h4>

            {supportRequests.map(req => (
              <div
                key={req.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{req.subject}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {req.status === 'respondida' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Respondida
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> En espera de respuesta
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{req.date}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{req.message}"
                </p>

                {req.response && (
                  <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100 text-xs space-y-1">
                    <div className="font-bold text-sky-900 flex items-center justify-between">
                      <span>Respuesta de: {req.respondedBy}</span>
                      <span className="text-[10px] text-sky-600 font-normal">{req.respondedAt}</span>
                    </div>
                    <p className="text-sky-950 leading-relaxed">{req.response}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Educational Library */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {education.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between hover:border-sky-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700">
                    {item.category.replace('_', ' ')}
                  </span>

                  {item.read ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Leído
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-600 font-semibold">
                      Pendiente
                    </span>
                  )}
                </div>

                <h4 className={`font-bold text-slate-900 ${easyMode ? 'text-base' : 'text-sm'}`}>
                  {item.title}
                </h4>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">{item.readTime}</span>
                <button
                  onClick={() => setSelectedEdu(item)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 transition flex items-center gap-1"
                >
                  <span>Leer Contenido</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Educational Article Reader Modal */}
      {selectedEdu && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                  Guía Educativa PosUCI
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-0.5">{selectedEdu.title}</h3>
                <span className="text-xs text-slate-400">{selectedEdu.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedEdu(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="prose prose-sm text-xs text-slate-700 leading-relaxed whitespace-pre-line">
              {selectedEdu.content}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-amber-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" /> +20 XP por leer
              </span>
              <button
                onClick={() => {
                  markEducationRead(selectedEdu.id);
                  setSelectedEdu(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como Leído y Sumar XP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
