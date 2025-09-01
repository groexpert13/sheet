'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Target, User, Package, BarChart3, FileText, Wrench, DollarSign, Rocket } from 'lucide-react';
import IntroSection from '@/components/sections/IntroSection';
import ProductLineSection from '@/components/sections/ProductLineSection';
import CompetencySection from '@/components/sections/CompetencySection';
import ToolsSection from '@/components/sections/ToolsSection';
import FinanceSection from '@/components/sections/FinanceSection';
import ActionPlanSection from '@/components/sections/ActionPlanSection';
import CompetencyWheel, { CompetencyWheelHandle } from '@/components/CompetencyWheel';
import { DiagnosticData, IntroData, ProductLineData, CompetencyData, ToolsData, FinanceData, ActionItem } from '@/types/diagnostic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const sections = [
  { id: 'intro', title: 'Знакомство', icon: User, description: 'Базовая информация о вас и вашем проекте' },
  { id: 'products', title: 'Продуктовая линейка', icon: Package, description: 'Анализ ваших продуктов и услуг' },
  { id: 'competency', title: 'Стадия проекта', icon: BarChart3, description: 'Оценка 6 ключевых компетенций' },
  { id: 'tools', title: 'Инструменты', icon: Wrench, description: 'Выбор маркетинговых инструментов' },
  { id: 'finance', title: 'Модель заработка', icon: DollarSign, description: 'Расчет финансовых показателей' },
  { id: 'plan', title: 'План действий', icon: Rocket, description: 'Приоритизация задач и планирование' }
];

export default function Home() {
  const router = useRouter();
  const wheelRef = useRef<CompetencyWheelHandle | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({
    intro: {},
    products: {},
    competency: {
      traffic: 1,
      expertise: 1,
      sales: 1,
      content: 1,
      product: 1,
      satisfaction: 1
    },
    tools: {},
    finance: {},
    plan: []
  });

  const [completedSections, setCompletedSections] = useState<boolean[]>(new Array(sections.length).fill(false));
  const [wheelOpen, setWheelOpen] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('authUser');
    if (!auth) {
      router.replace('/auth');
      return;
    }

    const saved = localStorage.getItem('diagnostic-data');
    if (saved) {
      setDiagnosticData(JSON.parse(saved));
    }
  }, [router]);

  useEffect(() => {
    localStorage.setItem('diagnostic-data', JSON.stringify(diagnosticData));
  }, [diagnosticData]);

  const updateData = (section: string, data: any) => {
    setDiagnosticData(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof DiagnosticData], ...data }
    }));
  };

  const markSectionComplete = (index: number) => {
    setCompletedSections(prev => {
      const newCompleted = [...prev];
      newCompleted[index] = true;
      return newCompleted;
    });
  };

  const calculateProgress = () => {
    return (completedSections.filter(Boolean).length / sections.length) * 100;
  };

  const getAchievementLevel = () => {
    const completed = completedSections.filter(Boolean).length;
    if (completed === 0) return { level: 'Новичок', color: 'bg-gray-400' };
    if (completed <= 2) return { level: 'Исследователь', color: 'bg-blue-400' };
    if (completed <= 4) return { level: 'Стратег', color: 'bg-purple-400' };
    if (completed === 6) return { level: 'Мастер маркетинга', color: 'bg-yellow-400' };
    return { level: 'Эксперт', color: 'bg-green-400' };
  };

  const renderCurrentSection = () => {
    const sectionId = sections[currentSection].id as typeof sections[number]['id'];

    switch (sectionId) {
      case 'intro':
        return (
          <IntroSection
            data={diagnosticData.intro}
            updateData={(data: IntroData) => updateData('intro', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      case 'products':
        return (
          <ProductLineSection
            data={diagnosticData.products}
            updateData={(data: ProductLineData) => updateData('products', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      case 'competency':
        return (
          <CompetencySection
            data={diagnosticData.competency}
            updateData={(data: CompetencyData) => updateData('competency', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      case 'tools':
        return (
          <ToolsSection
            data={diagnosticData.tools}
            updateData={(data: ToolsData) => updateData('tools', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      case 'finance':
        return (
          <FinanceSection
            data={diagnosticData.finance}
            updateData={(data: FinanceData) => updateData('finance', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      case 'plan':
        return (
          <ActionPlanSection
            data={diagnosticData.plan}
            updateData={(data: ActionItem[]) => updateData('plan', data)}
            onComplete={() => markSectionComplete(currentSection)}
          />
        );
      default:
        return <div>Раздел не найден</div>;
    }
  };

  const achievement = getAchievementLevel();
  const progress = calculateProgress();

  const downloadPdf = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const styles = `
      body { font-family: ui-sans-serif, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: #111827; }
      h1 { font-size: 20px; margin: 0 0 12px; }
      h2 { font-size: 16px; margin: 18px 0 8px; }
      p, li, td { font-size: 12px; line-height: 1.5; }
      .muted { color: #6B7280; }
      table { width: 100%; border-collapse: collapse; }
      th, td { border: 1px solid #E5E7EB; padding: 6px 8px; text-align: left; }
      .badge { display:inline-block; padding:2px 8px; border-radius:9999px; background:#3B82F6; color:#fff; font-size:11px; }
    `;
    const dd = diagnosticData;
    const date = new Date().toLocaleString();
    const competencyName: Record<string,string> = {
      traffic: 'Трафик',
      expertise: 'Экспертность',
      sales: 'Продажи',
      content: 'Контент',
      product: 'Продукт',
      satisfaction: 'Удовлетворение',
    };
    const competencyRows = Object.entries(dd.competency || {})
      .map(([k,v]) => `<tr><td>${competencyName[k] || k}</td><td>${v}</td></tr>`)
      .join('');

    // Tools: render by category with priorities if present
    const toolCategoryName: Record<string,string> = {
      packaging: 'Упаковка',
      paidTraffic: 'Платный трафик',
      content: 'Контент',
      funnel: 'Воронка',
      technical: 'Технические аспекты',
      sales: 'Продажа',
      product: 'Продукт',
    };
    const prMap: Record<string, string> = { high: 'Первая очередь', medium: 'Важная', low: 'Будущее' };
    const toolsRows = Object.keys(toolCategoryName)
      .map((cat) => {
        const list = (dd.tools as any)?.[cat] as string[] | undefined;
        if (!list || list.length === 0) return '';
        const rows = list.map((tool) => {
          const key = `${cat}-${tool}`;
          const pr = (dd.tools as any)?.priorities?.[key];
          const prText = pr ? prMap[pr] : '';
          return `<tr><td>${toolCategoryName[cat]}</td><td>${tool}</td><td>${prText}</td></tr>`;
        }).join('');
        return rows;
      })
      .join('');

    // Plan rows: use ActionItem fields
    const planRows = (dd.plan || [])
      .map((it: any, i: number) => {
        const months: string[] = [];
        if (it.july) months.push('Июль');
        if (it.august) months.push('Август');
        if (it.september) months.push('Сентябрь');
        return `<tr>
          <td>${i+1}</td>
          <td>${it.task || ''}</td>
          <td>${it.priority ?? ''}</td>
          <td>${it.competency || ''}</td>
          <td>${it.complexity ?? ''}</td>
          <td>${months.join(', ')}</td>
        </tr>`;
      })
      .join('');
    const productsRows = Object.entries(dd.products || {}).map(([k,v]) => `<tr><td>${k}</td><td>${String(v)}</td></tr>`).join('');
    const introRows = Object.entries(dd.intro || {}).map(([k,v]) => `<tr><td>${k}</td><td>${String(v)}</td></tr>`).join('');
    const financeRows = Object.entries(dd.finance || {}).map(([k,v]) => `<tr><td>${k}</td><td>${String(v)}</td></tr>`).join('');
    win.document.write(`
      <html>
        <head>
          <title>Диагностика — отчет</title>
          <meta charset="utf-8" />
          <style>${styles}</style>
        </head>
        <body>
          <h1>Маркетинговая диагностика <span class="badge">${Math.round(progress)}% завершено</span></h1>
          <p class="muted">Сформировано: ${date}</p>

          <h2>1. Знакомство</h2>
          <table><tbody>${introRows || '<tr><td colspan="2" class="muted">Пусто</td></tr>'}</tbody></table>

          <h2>2. Продуктовая линейка</h2>
          <table><tbody>${productsRows || '<tr><td colspan="2" class="muted">Пусто</td></tr>'}</tbody></table>

          <h2>3. Стадия проекта (Колесо компетенций)</h2>
          <table>
            <thead><tr><th>Компетенция</th><th>Оценка (0-5)</th></tr></thead>
            <tbody>${competencyRows || '<tr><td colspan="2" class="muted">Пусто</td></tr>'}</tbody>
          </table>

          <h2>4. Инструменты</h2>
          <table>
            <thead><tr><th>Категория</th><th>Инструмент</th><th>Приоритет</th></tr></thead>
            <tbody>${toolsRows || '<tr><td colspan="3" class="muted">Пусто</td></tr>'}</tbody>
          </table>

          <h2>5. Модель заработка</h2>
          <table><tbody>${financeRows || '<tr><td colspan="2" class="muted">Пусто</td></tr>'}</tbody></table>

          <h2>6. План действий</h2>
          <table>
            <thead><tr><th>#</th><th>Задача</th><th>Приоритет</th><th>Компетенция</th><th>Сложность</th><th>Месяцы</th></tr></thead>
            <tbody>${planRows || '<tr><td colspan="6" class="muted">Пусто</td></tr>'}</tbody>
          </table>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Маркетинговая диагностика</h1>
                <p className="text-sm text-gray-600">Пошаговый разбор вашего маркетинга</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className={`${achievement.color} text-white`}>
                {achievement.level}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{Math.round(progress)}% завершено</p>
                <Progress value={progress} className="w-32" />
              </div>
              <Button
                variant="default"
                onClick={downloadPdf}
              >
                Скачать PDF
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('authUser');
                  router.replace('/auth');
                }}
              >
                Выйти
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
            <Card className="border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Разделы диагностики</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = currentSection === index;
                  const isCompleted = completedSections[index];
                  const canAccess = index === 0 || completedSections.slice(0, index).every(Boolean);
                  
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        if (canAccess) setCurrentSection(index);
                      }}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gray-100 text-gray-900 border border-gray-200'
                          : canAccess
                          ? 'hover:bg-gray-50 text-gray-700 border border-transparent'
                          : 'text-gray-400 cursor-not-allowed border border-transparent'
                      }`}
                      disabled={!canAccess}
                    >
                      <div className={`flex-shrink-0 ${isCompleted ? 'text-green-600' : ''}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs opacity-75">{section.description}</p>
                      </div>
                      {isCompleted && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
            
            {/* Competency Wheel - always visible, with modal expansion */}
            <Card className="border">
              <CardHeader>
                <CardTitle className="text-center">Колесо компетенций</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center w-full">
                  <CompetencyWheel competencyData={diagnosticData.competency} height={220} compact />
                </div>
                <Dialog open={wheelOpen} onOpenChange={setWheelOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">Открыть полностью</Button>
                  </DialogTrigger>
                  <DialogContent className="w-screen h-[90vh] max-w-none sm:rounded-none p-4 md:p-6">
                    <DialogHeader className="flex flex-row items-center justify-between">
                      <DialogTitle>Колесо компетенций</DialogTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => wheelRef.current?.exportPng('maol-competency-wheel.png')}
                        >
                          Скачать PNG
                        </Button>
                      </div>
                    </DialogHeader>
                    <div className="mt-4 flex h-[calc(90vh-100px)] items-center justify-center">
                      <CompetencyWheel ref={wheelRef} competencyData={diagnosticData.competency} height={600} />
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="border">
              <CardHeader className="bg-white text-gray-900 border-b rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{sections[currentSection].title}</CardTitle>
                    <p className="text-gray-600">{sections[currentSection].description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Шаг {currentSection + 1} из {sections.length}</p>
                    <div className="w-24 mt-1">
                      <Progress value={((currentSection + 1) / sections.length) * 100} />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {renderCurrentSection()}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                    disabled={currentSection === 0}
                  >
                    Назад
                  </Button>
                  
                  <div className="flex space-x-2">
                    {sections.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSection 
                            ? 'bg-blue-600' 
                            : completedSections[index]
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => {
                      if (currentSection < sections.length - 1 && completedSections[currentSection]) {
                        setCurrentSection(currentSection + 1);
                      }
                    }}
                    disabled={currentSection === sections.length - 1 || !completedSections[currentSection]}
                  >
                    Далее
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}