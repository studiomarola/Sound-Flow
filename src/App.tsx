/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Music, 
  CheckSquare, 
  Megaphone, 
  Calendar as CalendarIcon, 
  Plus, 
  Search, 
  MoreVertical,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  Upload,
  CheckCircle2,
  Circle,
  AlertCircle,
  X,
  Menu,
  Play,
  Pause,
  Instagram,
  Youtube,
  Radio,
  Send,
  Share,
  Image as ImageIcon,
  Video,
  FileAudio,
  Download,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Song, SongStatus, Task, MarketingAction } from './types';

// --- Components ---

const InstallPrompt = () => {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
    
    setIsIOS(isIosDevice);
    setIsStandalone(isStandaloneMode);
    
    if (isIosDevice && !isStandaloneMode) {
      const hasSeenPrompt = localStorage.getItem('hasSeenInstallPrompt');
      if (!hasSeenPrompt) {
        setShowPrompt(true);
      }
    }
  }, []);

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('hasSeenInstallPrompt', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] md:hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex flex-col gap-3 relative">
        <button onClick={dismissPrompt} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-black">
          <X size={16} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white flex-shrink-0">
            <Music size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm">Instale o SoundFlow</h4>
            <p className="text-xs text-gray-500">Adicione à tela inicial para usar como app.</p>
          </div>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600 flex items-center gap-2">
          <span>Toque em</span>
          <Share size={14} className="text-blue-500" />
          <span>e depois em <strong>Adicionar à Tela de Início</strong></span>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen, songs }: { activeTab: string, setActiveTab: (t: string) => void, isOpen: boolean, setIsOpen: (o: boolean) => void, songs: Song[] }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'songs', label: 'Músicas', icon: Music },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
  ];

  const producingCount = songs.filter(s => ['Draft', 'Production', 'Mixing', 'Mastering'].includes(s.status)).length;
  const distributionCount = songs.filter(s => ['Distribution', 'Promotion'].includes(s.status)).length;
  const releasedCount = songs.filter(s => s.status === 'Released').length;

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={`w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <Music size={18} />
            </div>
            SoundFlow
          </h1>
          <button className="md:hidden p-2" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-black text-white shadow-lg shadow-black/10' 
                : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
              <Music size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total de Músicas</p>
              <p className="text-xl font-bold text-black leading-none mt-1">{songs.length}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Lançadas</span>
              <span className="font-bold">{releasedCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div> A Distribuir</span>
              <span className="font-bold">{distributionCount}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-500 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Produzindo</span>
              <span className="font-bold">{producingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

const Dashboard = ({ songs, tasks, onSelectSong }: { songs: Song[], tasks: Task[], onSelectSong: (song: Song) => void }) => {
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const stats = [
    { label: 'Em Produção', value: songs.filter(s => s.status === 'Production').length, color: 'text-blue-600' },
    { label: 'Prontas p/ Mix', value: songs.filter(s => s.status === 'Mixing').length, color: 'text-purple-600' },
    { label: 'Lançadas', value: songs.filter(s => s.status === 'Released').length, color: 'text-emerald-600' },
    { label: 'Tarefas Pendentes', value: tasks.filter(t => t.status === 'pending').length, color: 'text-orange-600' },
  ];

  const togglePlay = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudio === url) {
      audioElement?.pause();
      setPlayingAudio(null);
    } else {
      if (audioElement) {
        audioElement.pause();
      }
      const newAudio = new Audio(url);
      newAudio.play();
      newAudio.onended = () => setPlayingAudio(null);
      setAudioElement(newAudio);
      setPlayingAudio(url);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Visão Geral</h2>
        <p className="text-gray-500">Bem-vindo de volta ao seu centro de comando musical.</p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm"
          >
            <p className="text-xs md:text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`text-2xl md:text-4xl font-bold mt-1 md:mt-2 ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold">Próximos Lançamentos</h3>
              <button className="text-sm text-gray-500 hover:text-black flex items-center gap-1">
                Ver Calendário <ChevronRight size={16} />
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {songs.filter(s => s.release_date).sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime()).slice(0, 4).map(song => (
                <div 
                  key={song.id} 
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onSelectSong(song)}
                >
                  <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {song.cover_url ? (
                          <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Music size={20} />
                          </div>
                        )}
                      </div>
                      {song.audio_url && (
                        <button 
                          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-black transition-colors flex-shrink-0"
                          onClick={(e) => togglePlay(song.audio_url!, e)}
                        >
                          {playingAudio === song.audio_url ? (
                            <Pause size={16} className="fill-black" />
                          ) : (
                            <Play size={16} className="fill-black" />
                          )}
                        </button>
                      )}
                    </div>
                    <div className="min-w-0 pr-2">
                      <p className="font-semibold truncate text-sm md:text-base">{song.title}</p>
                      <p className="text-xs text-gray-500 truncate">{song.artists || 'Artista Principal'}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs md:text-sm font-bold">{new Date(song.release_date).toLocaleDateString('pt-BR')}</p>
                    <span className={`status-badge status-${song.status.toLowerCase()} mt-1 inline-block`}>{song.status}</span>
                  </div>
                </div>
              ))}
              {songs.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  Nenhum lançamento agendado.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              Alertas Urgentes
            </h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'pending').slice(0, 3).map(task => (
                <div key={task.id} className="flex gap-3 items-start">
                  <div className="mt-1">
                    <Circle size={14} className="text-gray-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">Prazo: {task.deadline || 'Sem data'}</p>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-gray-400 italic">Tudo em dia por aqui!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SongManagement = ({ songs, onAddSong, onUpdateSong, onDeleteSong, initialSelectedSong, onClearSelection }: { 
  songs: Song[], 
  onAddSong: (s: Partial<Song>) => void,
  onUpdateSong: (id: number, s: Partial<Song>) => void,
  onDeleteSong: (id: number) => void,
  initialSelectedSong?: Song | null,
  onClearSelection?: () => void
}) => {
  const [isModalOpen, setIsModalOpen] = useState(!!initialSelectedSong);
  const [selectedSong, setSelectedSong] = useState<Song | null>(initialSelectedSong || null);
  const [newSong, setNewSong] = useState<Partial<Song>>({
    title: '',
    genre: '',
    status: 'Draft',
    artists: '',
    lyrics: ''
  });

  useEffect(() => {
    if (initialSelectedSong) {
      setSelectedSong(initialSelectedSong);
      setIsModalOpen(true);
    }
  }, [initialSelectedSong]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (onClearSelection) onClearSelection();
  };

  const [isUploading, setIsUploading] = useState(false);

  const statusOptions: SongStatus[] = ['Draft', 'Production', 'Mixing', 'Mastering', 'Distribution', 'Released', 'Promotion'];

  const handleCopyLyrics = (lyrics: string) => {
    navigator.clipboard.writeText(lyrics);
    alert('Letra copiada para a área de transferência!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'audio') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.url) {
        if (selectedSong) {
          setSelectedSong({ ...selectedSong, [type === 'cover' ? 'cover_url' : 'audio_url']: data.url });
        } else {
          setNewSong({ ...newSong, [type === 'cover' ? 'cover_url' : 'audio_url']: data.url });
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Erro ao fazer upload do arquivo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Suas Músicas</h2>
          <p className="text-gray-500">Gerencie seu catálogo e o progresso de cada faixa.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedSong(null);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          <Plus size={20} /> Nova Música
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {songs.map((song) => (
          <motion.div 
            layoutId={`song-${song.id}`}
            key={song.id} 
            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group cursor-pointer"
            onClick={() => {
              setSelectedSong(song);
              setIsModalOpen(true);
            }}
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {song.cover_url ? (
                <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <Music size={64} strokeWidth={1} />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`status-badge status-${song.status.toLowerCase()} shadow-sm`}>{song.status}</span>
              </div>
            </div>
            <div className="p-5">
              <h4 className="font-bold text-lg truncate">{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artists || 'Artista Principal'}</p>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1"><CalendarIcon size={12} /> {song.release_date || 'Sem data'}</span>
                <span className="bg-gray-50 px-2 py-1 rounded-md">{song.genre}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col"
            >
              <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h3 className="text-xl font-bold">{selectedSong ? 'Editar Música' : 'Nova Música'}</h3>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Left Column: Details */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Título</label>
                      <input 
                        type="text" 
                        value={selectedSong ? (selectedSong.title || '') : (newSong.title || '')}
                        onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, title: e.target.value}) : setNewSong({...newSong, title: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Ex: Sua Nova Balada"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gênero</label>
                        <input 
                          type="text" 
                          value={selectedSong ? (selectedSong.genre || '') : (newSong.genre || '')}
                          onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, genre: e.target.value}) : setNewSong({...newSong, genre: e.target.value})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                          placeholder="Pop, Rock..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                        <select 
                          value={selectedSong ? (selectedSong.status || 'Draft') : (newSong.status || 'Draft')}
                          onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, status: e.target.value as SongStatus}) : setNewSong({...newSong, status: e.target.value as SongStatus})}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none"
                        >
                          {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data de Lançamento Alvo</label>
                      <input 
                        type="date" 
                        value={selectedSong ? (selectedSong.release_date || '') : (newSong.release_date || '')}
                        onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, release_date: e.target.value}) : setNewSong({...newSong, release_date: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Artistas Participantes</label>
                      <input 
                        type="text" 
                        value={selectedSong ? (selectedSong.artists || '') : (newSong.artists || '')}
                        onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, artists: e.target.value}) : setNewSong({...newSong, artists: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5"
                        placeholder="Separe por vírgula"
                      />
                    </div>
                    
                    {selectedSong && (
                      <div className="pt-6 border-t border-gray-100 space-y-4">
                        <h4 className="font-bold text-sm">Links de Distribuição</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#1DB954] rounded-full flex items-center justify-center text-white"><Music size={14} /></div>
                            <input 
                              type="text" 
                              placeholder="Spotify Link"
                              value={selectedSong.spotify_link || ''}
                              onChange={(e) => setSelectedSong({...selectedSong, spotify_link: e.target.value})}
                              className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-[#FF0000] rounded-full flex items-center justify-center text-white"><Music size={14} /></div>
                            <input 
                              type="text" 
                              placeholder="YouTube Link"
                              value={selectedSong.youtube_link || ''}
                              onChange={(e) => setSelectedSong({...selectedSong, youtube_link: e.target.value})}
                              className="flex-1 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Lyrics & Media */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Letra</label>
                        {(selectedSong?.lyrics || newSong.lyrics) && (
                          <button 
                            onClick={() => handleCopyLyrics(selectedSong ? selectedSong.lyrics : newSong.lyrics!)}
                            className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                          >
                            <Copy size={12} /> Copiar Letra Completa
                          </button>
                        )}
                      </div>
                      <textarea 
                        value={selectedSong ? (selectedSong.lyrics || '') : (newSong.lyrics || '')}
                        onChange={(e) => selectedSong ? setSelectedSong({...selectedSong, lyrics: e.target.value}) : setNewSong({...newSong, lyrics: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 h-64 resize-none font-serif text-lg leading-relaxed"
                        placeholder="Digite ou cole a letra aqui..."
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">Capa e Áudio</label>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-black transition-colors p-4 text-center relative overflow-hidden">
                          <input id="cover-upload" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'cover')} disabled={isUploading} />
                          {(selectedSong?.cover_url || newSong.cover_url) ? (
                            <>
                              <img src={selectedSong ? selectedSong.cover_url : newSong.cover_url} alt="Cover" className="absolute inset-0 w-full h-full object-cover" />
                              <label htmlFor="cover-upload" className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <span className="text-white text-[10px] font-bold uppercase">Trocar Capa</span>
                              </label>
                            </>
                          ) : (
                            <label htmlFor="cover-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                              <Upload size={24} className="mb-2" />
                              <span className="text-[10px] font-bold uppercase">{isUploading ? 'Enviando...' : 'Upload Capa'}</span>
                            </label>
                          )}
                        </div>
                        <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-black transition-colors p-4 text-center relative">
                          <input id="audio-upload" type="file" accept="audio/*, .mp3, .wav" className="hidden" onChange={(e) => handleFileUpload(e, 'audio')} disabled={isUploading} />
                          {(selectedSong?.audio_url || newSong.audio_url) ? (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                              <CheckCircle2 size={24} className="mb-2 text-emerald-500" />
                              <span className="text-[10px] font-bold uppercase text-emerald-500 mb-2">Áudio Enviado</span>
                              <audio controls src={selectedSong ? selectedSong.audio_url : newSong.audio_url} className="w-full max-w-[120px] h-8" />
                              <label htmlFor="audio-upload" className="mt-2 text-[10px] font-bold uppercase text-gray-500 hover:text-black cursor-pointer">Trocar Áudio</label>
                            </div>
                          ) : (
                            <label htmlFor="audio-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                              <Music size={24} className="mb-2" />
                              <span className="text-[10px] font-bold uppercase">{isUploading ? 'Enviando...' : 'Upload Áudio'}</span>
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                {selectedSong ? (
                  <button 
                    onClick={() => {
                      if(confirm('Tem certeza que deseja excluir esta música?')) {
                        onDeleteSong(selectedSong.id);
                        setIsModalOpen(false);
                      }
                    }}
                    className="text-red-500 font-bold text-sm hover:underline w-full md:w-auto text-center"
                  >
                    Excluir Música
                  </button>
                ) : <div className="hidden md:block" />}
                <div className="flex gap-2 md:gap-3 w-full md:w-auto">
                  <button 
                    onClick={handleCloseModal}
                    className="flex-1 md:flex-none px-4 md:px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors text-sm md:text-base"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      if (selectedSong) {
                        onUpdateSong(selectedSong.id, selectedSong);
                      } else {
                        onAddSong(newSong);
                      }
                      handleCloseModal();
                    }}
                    className="flex-1 md:flex-none bg-black text-white px-4 md:px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform text-sm md:text-base"
                  >
                    {selectedSong ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TaskManagement = ({ songs, tasks, onAddTask, onToggleTask }: { 
  songs: Song[], 
  tasks: Task[], 
  onAddTask: (t: Partial<Task>) => void,
  onToggleTask: (id: number, status: 'pending' | 'completed') => void
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedSongId, setSelectedSongId] = useState<number | ''>('');

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Tarefas e Colaboração</h2>
        <p className="text-gray-500">Mantenha o fluxo de trabalho organizado para cada projeto.</p>
      </header>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <select 
            value={selectedSongId}
            onChange={(e) => setSelectedSongId(Number(e.target.value))}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 font-medium w-full md:w-auto"
          >
            <option value="">Selecionar Música...</option>
            {songs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="O que precisa ser feito?"
            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 w-full md:w-auto"
          />
          <button 
            onClick={() => {
              if (newTaskTitle && selectedSongId) {
                onAddTask({ title: newTaskTitle, song_id: Number(selectedSongId) });
                setNewTaskTitle('');
              }
            }}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold w-full md:w-auto"
          >
            Adicionar
          </button>
        </div>

        <div className="space-y-2">
          {tasks.map(task => (
            <div key={task.id} className="group flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onToggleTask(task.id, task.status === 'pending' ? 'completed' : 'pending')}
                  className={`transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-gray-300 hover:text-black'}`}
                >
                  {task.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : ''}`}>{task.title}</p>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[10px] uppercase tracking-widest font-bold">
                      {songs.find(s => s.id === task.song_id)?.title || 'Música Desconhecida'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {task.deadline || 'Sem prazo'}</span>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors"><MoreVertical size={16} /></button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic">
              Nenhuma tarefa pendente. Comece criando uma acima!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MarketingModule = ({ songs, marketingActions, onAddAction, onToggleAction }: { 
  songs: Song[], 
  marketingActions: MarketingAction[],
  onAddAction: (a: Partial<MarketingAction>) => void,
  onToggleAction: (id: number, status: 'pending' | 'completed') => void
}) => {
  const [activeMarketingTab, setActiveMarketingTab] = useState<'checklist' | 'content' | 'pitching'>('checklist');
  const [files, setFiles] = useState<{id: string, name: string, type: 'video' | 'photo' | 'audio', url: string, size: string}[]>([]);

  useEffect(() => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error('Failed to fetch files:', err));
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'photo' | 'audio') => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      try {
        const res = await fetch('/api/files', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          const newFile = await res.json();
          setFiles(prev => [newFile, ...prev]);
        }
      } catch (err) {
        console.error('Failed to upload file:', err);
      }
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/files/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete file:', err);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">Promoção e Marketing</h2>
        <p className="text-gray-500">Estratégias para garantir que sua música chegue ao mundo.</p>
      </header>

      {/* Marketing Navigation */}
      <div className="flex gap-4 border-b border-gray-200 overflow-x-auto pb-px">
        <button 
          onClick={() => setActiveMarketingTab('checklist')}
          className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeMarketingTab === 'checklist' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Checklist de Lançamento
        </button>
        <button 
          onClick={() => setActiveMarketingTab('content')}
          className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeMarketingTab === 'content' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Estratégia de Conteúdo
        </button>
        <button 
          onClick={() => setActiveMarketingTab('pitching')}
          className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors ${activeMarketingTab === 'pitching' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-gray-600'}`}
        >
          Pitching & Playlists
        </button>
      </div>

      {activeMarketingTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                  <Clock size={18} />
                </div>
                Ações Pré-Lançamento
              </h3>
              <div className="space-y-4">
                {marketingActions.filter(a => a.type === 'pre').map(action => (
                  <div key={action.id} className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleAction(action.id, action.status === 'pending' ? 'completed' : 'pending')}
                      className={`p-2 -ml-2 ${action.status === 'completed' ? 'text-emerald-500' : 'text-gray-300'}`}
                    >
                      {action.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <span className={`text-sm ${action.status === 'completed' ? 'text-gray-400 line-through' : ''}`}>{action.title}</span>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const title = prompt('Título da ação pré-lançamento:');
                    if(title) onAddAction({ title, type: 'pre', song_id: songs[0]?.id });
                  }}
                  className="text-sm font-bold text-gray-400 hover:text-black flex items-center gap-1 mt-4 py-2"
                >
                  <Plus size={16} /> Adicionar Ação
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Megaphone size={18} />
                </div>
                Ações Pós-Lançamento
              </h3>
              <div className="space-y-4">
                {marketingActions.filter(a => a.type === 'post').map(action => (
                  <div key={action.id} className="flex items-center gap-3">
                    <button 
                      onClick={() => onToggleAction(action.id, action.status === 'pending' ? 'completed' : 'pending')}
                      className={`p-2 -ml-2 ${action.status === 'completed' ? 'text-emerald-500' : 'text-gray-300'}`}
                    >
                      {action.status === 'completed' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    <span className={`text-sm ${action.status === 'completed' ? 'text-gray-400 line-through' : ''}`}>{action.title}</span>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const title = prompt('Título da ação pós-lançamento:');
                    if(title) onAddAction({ title, type: 'post', song_id: songs[0]?.id });
                  }}
                  className="text-sm font-bold text-gray-400 hover:text-black flex items-center gap-1 mt-4 py-2"
                >
                  <Plus size={16} /> Adicionar Ação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeMarketingTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Videos */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-xl flex items-center justify-center">
                  <Video size={20} />
                </div>
                <h3 className="font-bold">Vídeos</h3>
              </div>
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus size={20} className="text-gray-500" />
                <input type="file" accept="video/*" className="hidden" onChange={(e) => handleFileUpload(e, 'video')} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-4">Reels, TikToks, Teasers e Clipes.</p>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
              {files.filter(f => f.type === 'video').map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Video size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={file.url} download={file.name} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-black transition-colors">
                      <Download size={14} />
                    </a>
                    <button onClick={() => handleDeleteFile(file.id)} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {files.filter(f => f.type === 'video').length === 0 && (
                <p className="text-xs text-center text-gray-400 py-4">Nenhum vídeo adicionado.</p>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                  <ImageIcon size={20} />
                </div>
                <h3 className="font-bold">Fotos & Artes</h3>
              </div>
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus size={20} className="text-gray-500" />
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'photo')} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-4">Capas, Posts, Stories e Press Photos.</p>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
              {files.filter(f => f.type === 'photo').map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <ImageIcon size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={file.url} download={file.name} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-black transition-colors">
                      <Download size={14} />
                    </a>
                    <button onClick={() => handleDeleteFile(file.id)} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {files.filter(f => f.type === 'photo').length === 0 && (
                <p className="text-xs text-center text-gray-400 py-4">Nenhuma foto adicionada.</p>
              )}
            </div>
          </div>

          {/* Audios */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FileAudio size={20} />
                </div>
                <h3 className="font-bold">Áudios</h3>
              </div>
              <label className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Plus size={20} className="text-gray-500" />
                <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, 'audio')} />
              </label>
            </div>
            <p className="text-sm text-gray-500 mb-4">Guias, Stems, Playbacks e Áudios Oficiais.</p>
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-2">
              {files.filter(f => f.type === 'audio').map(file => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileAudio size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-[10px] text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={file.url} download={file.name} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-black transition-colors">
                      <Download size={14} />
                    </a>
                    <button onClick={() => handleDeleteFile(file.id)} className="p-1.5 hover:bg-white rounded-md text-gray-500 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {files.filter(f => f.type === 'audio').length === 0 && (
                <p className="text-xs text-center text-gray-400 py-4">Nenhum áudio adicionado.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeMarketingTab === 'pitching' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold flex items-center gap-2">
              <Radio size={18} className="text-purple-500" />
              Pitching para Playlists e Curadores
            </h3>
            <p className="text-sm text-gray-500 mt-1">Acompanhe o envio da sua música para curadores e plataformas.</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Music size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Spotify for Artists</h4>
                    <p className="text-xs text-gray-500">Pitch para editores do Spotify (Mínimo 7 dias antes)</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Funcionalidade em desenvolvimento!')}
                  className="w-full md:w-auto px-4 py-3 md:py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Marcar como Enviado
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Send size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">SubmitHub / Groover</h4>
                    <p className="text-xs text-gray-500">Envio para blogs e curadores independentes</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Funcionalidade em desenvolvimento!')}
                  className="w-full md:w-auto px-4 py-3 md:py-2 bg-white border border-gray-200 text-black text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Acessar Plataforma
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <Radio size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">Rádios Locais / Web Rádios</h4>
                    <p className="text-xs text-gray-500">Envio de press release e MP3</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('Funcionalidade em desenvolvimento!')}
                  className="w-full md:w-auto px-4 py-3 md:py-2 bg-white border border-gray-200 text-black text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Ver Contatos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-black text-white rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Dica do SoundFlow: Maratona de Conteúdo</h3>
          <p className="text-gray-400 text-xs md:text-sm leading-relaxed mb-6">
            Crie conteúdo para 2 semanas em apenas 2 dias! Foque em gravar trechos curtos, 
            B-roll de estúdio e frases marcantes das suas letras. Agende tudo e foque na sua música.
          </p>
          <button className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform w-full md:w-auto">
            Ver Guia Completo
          </button>
        </div>
        <div className="absolute right-[-50px] bottom-[-50px] opacity-10 pointer-events-none">
          <Music size={200} className="md:w-[300px] md:h-[300px]" strokeWidth={1} />
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardSelectedSong, setDashboardSelectedSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [marketingActions, setMarketingActions] = useState<MarketingAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [songsRes, tasksRes, marketingRes] = await Promise.all([
        fetch('/api/songs'),
        fetch('/api/tasks'), // This needs a global endpoint or we fetch per song
        fetch('/api/marketing') // Same here
      ]);
      
      // For simplicity in this demo, let's assume we have endpoints that return all
      // In the real server.ts I added these or similar
      const songsData = await songsRes.json();
      setSongs(songsData);
      
      // Fetch tasks for each song or a global one
      // Let's adjust server.ts to have global getters for tasks/marketing for the dashboard
      const tRes = await fetch('/api/tasks/all');
      const mRes = await fetch('/api/marketing/all');
      setTasks(await tRes.json());
      setMarketingActions(await mRes.json());
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const handleAddSong = async (song: Partial<Song>) => {
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song)
    });
    if (res.ok) fetchData();
  };

  const handleUpdateSong = async (id: number, song: Partial<Song>) => {
    const res = await fetch(`/api/songs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(song)
    });
    if (res.ok) fetchData();
  };

  const handleDeleteSong = async (id: number) => {
    const res = await fetch(`/api/songs/${id}`, { method: 'DELETE' });
    if (res.ok) fetchData();
  };

  const handleAddTask = async (task: Partial<Task>) => {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    });
    if (res.ok) fetchData();
  };

  const handleToggleTask = async (id: number, status: string) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  const handleAddMarketing = async (action: Partial<MarketingAction>) => {
    const res = await fetch('/api/marketing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    });
    if (res.ok) fetchData();
  };

  const handleToggleMarketing = async (id: number, status: string) => {
    const res = await fetch(`/api/marketing/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchData();
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-black"
        >
          <Music size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        songs={songs}
      />
      
      <main className="md:ml-64 p-4 md:p-10 pt-20 md:pt-10 max-w-7xl mx-auto">
        <InstallPrompt />
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-30 flex items-center px-4 justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center text-white">
              <Music size={14} />
            </div>
            SoundFlow
          </h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2">
            <Menu size={24} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && (
              <Dashboard 
                songs={songs} 
                tasks={tasks} 
                onSelectSong={(song) => {
                  setDashboardSelectedSong(song);
                  setActiveTab('songs');
                }} 
              />
            )}
            {activeTab === 'songs' && (
              <SongManagement 
                songs={songs} 
                onAddSong={handleAddSong} 
                onUpdateSong={handleUpdateSong}
                onDeleteSong={handleDeleteSong}
                initialSelectedSong={dashboardSelectedSong}
                onClearSelection={() => setDashboardSelectedSong(null)}
              />
            )}
            {activeTab === 'tasks' && (
              <TaskManagement 
                songs={songs} 
                tasks={tasks} 
                onAddTask={handleAddTask} 
                onToggleTask={handleToggleTask} 
              />
            )}
            {activeTab === 'marketing' && (
              <MarketingModule 
                songs={songs} 
                marketingActions={marketingActions} 
                onAddAction={handleAddMarketing} 
                onToggleAction={handleToggleMarketing} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
