'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Calendar, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ActionItem } from '@/types/diagnostic';

interface ActionPlanSectionProps {
  data: ActionItem[];
  updateData: (data: ActionItem[]) => void;
  onComplete: () => void;
}

const competencies = [
  'Трафик',
  'Экспертность',
  'Продажи', 
  'Контент',
  'Продукт',
  'Общее удовлетворение'
];

// Legacy month names for fallback display
const months = [
  { key: 'july', label: 'Июль' },
  { key: 'august', label: 'Август' },
  { key: 'september', label: 'Сентябрь' }
];

const ruMonthNames = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

function ymNow(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${m}`;
}

function generateFutureMonths(totalMonths = 24): string[] {
  const out: string[] = [];
  const start = new Date();
  start.setDate(1);
  for (let i = 0; i < totalMonths; i++) {
    const dt = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const ym = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
    out.push(ym);
  }
  return out;
}

function formatYm(ym: string): string {
  const [y, m] = ym.split('-');
  const idx = Number(m) - 1;
  const name = ruMonthNames[idx] || m;
  return `${name} ${y}`;
}

export default function ActionPlanSection({ data, updateData, onComplete }: ActionPlanSectionProps) {
  const [newTask, setNewTask] = useState<Partial<ActionItem>>({
    priority: 1,
    task: '',
    competency: '',
    complexity: 1,
    july: false,
    august: false,
    september: false
  });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const addTask = () => {
    if (newTask.task && newTask.competency) {
      const selectedMonths = (newTask.months || []) as string[];
      const task: ActionItem = {
        priority: newTask.priority || 1,
        task: newTask.task,
        competency: newTask.competency,
        complexity: newTask.complexity || 1,
        months: selectedMonths,
        // Backward compatibility flags (true if any selected month matches the respective number)
        july: selectedMonths.some(m => m.endsWith('-07')) || newTask.july || false,
        august: selectedMonths.some(m => m.endsWith('-08')) || newTask.august || false,
        september: selectedMonths.some(m => m.endsWith('-09')) || newTask.september || false
      };
      
      updateData([...data, task]);
      setNewTask({
        priority: 1,
        task: '',
        competency: '',
        complexity: 1,
        months: [],
        july: false,
        august: false,
        september: false
      });
    }
  };

  const removeTask = (index: number) => {
    updateData(data.filter((_, i) => i !== index));
  };

  const updateTask = (index: number, field: string, value: any) => {
    const updatedTasks = data.map((task, i) => 
      i === index ? { ...task, [field]: value } : task
    );
    updateData(updatedTasks);
  };

  const getPriorityColor = (priority: number) => {
    if (priority <= 2) return 'bg-red-500';
    if (priority <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getComplexityStars = (complexity: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < complexity ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">План действий</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Пропишем ключевые действия для выхода бизнеса на новый уровень и расставим приоритеты задач, 
          которые будут максимально полезны сейчас
        </p>
      </div>

      {/* Add New Task */}
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-900">
            <Plus className="h-5 w-5" />
            <span>Добавить новую задачу</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Приоритет</Label>
              <Select 
                value={newTask.priority?.toString()} 
                onValueChange={(value) => setNewTask({ ...newTask, priority: parseInt(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                    <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Компетенция</Label>
              <Select 
                value={newTask.competency} 
                onValueChange={(value) => setNewTask({ ...newTask, competency: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {competencies.map(comp => (
                    <SelectItem key={comp} value={comp}>{comp}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Сложность</Label>
              <Select 
                value={newTask.complexity?.toString()} 
                onValueChange={(value) => setNewTask({ ...newTask, complexity: parseInt(value) })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(c => (
                    <SelectItem key={c} value={c.toString()}>
                      <div className="flex items-center space-x-1">
                        {getComplexityStars(c)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Описание задачи</Label>
            <Input
              value={newTask.task || ''}
              onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
              placeholder="Введите описание задачи..."
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Месяцы выполнения</Label>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(newTask.months || []).length > 0 ? (
                (newTask.months as string[]).map((ym) => (
                  <Badge key={ym} variant="secondary">{formatYm(ym)}</Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">Не выбрано</span>
              )}
              <div className="ml-auto flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => {
                  const now = ymNow();
                  const set = new Set([...(newTask.months || []) as string[]]);
                  set.add(now);
                  setNewTask({ ...newTask, months: Array.from(set) });
                }}>Текущий месяц</Button>
                <Button type="button" size="sm" onClick={() => setMonthPickerOpen(true)}>Выбрать месяцы</Button>
              </div>
            </div>

            <Dialog open={monthPickerOpen} onOpenChange={setMonthPickerOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Выбор месяцев</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Выберите один или несколько месяцев. Доступны текущий и последующие месяцы.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {generateFutureMonths(24).map((ym) => (
                      <button
                        key={ym}
                        type="button"
                        onClick={() => {
                          const set = new Set([...(newTask.months || []) as string[]]);
                          if (set.has(ym)) set.delete(ym); else set.add(ym);
                          setNewTask({ ...newTask, months: Array.from(set).sort() });
                        }}
                        className={`px-3 py-2 rounded border text-sm text-left ${
                          (newTask.months || []).includes(ym) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        {formatYm(ym)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setMonthPickerOpen(false)}>Готово</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Button onClick={addTask} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Добавить задачу
          </Button>
        </CardContent>
      </Card>

      {/* Tasks List */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>План задач ({data.length})</span>
              <Badge className="bg-blue-500">{data.filter(t => t.july || t.august || t.september).length} запланировано</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...data]
                .sort((a, b) => a.priority - b.priority)
                .map((task, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <Badge className={`${getPriorityColor(task.priority)} text-white`}>
                          #{task.priority}
                        </Badge>
                        <div>
                          <p className="font-medium text-gray-900">{task.task}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant="outline">{task.competency}</Badge>
                            <div className="flex items-center space-x-1">
                              {getComplexityStars(task.complexity)}
                            </div>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(index)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(task.months) && task.months.length > 0 ? (
                          task.months.map((ym) => (
                            <Badge key={ym} className="bg-blue-500">{formatYm(ym)}</Badge>
                          ))
                        ) : (
                          months.map(month => (
                            <Badge 
                              key={month.key}
                              className={task[month.key as keyof ActionItem] ? 'bg-blue-500' : 'bg-gray-300'}
                            >
                              {month.label}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button 
          onClick={handleComplete}
          className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
        >
          Завершить диагностику
        </Button>
      </div>
    </div>
  );
}