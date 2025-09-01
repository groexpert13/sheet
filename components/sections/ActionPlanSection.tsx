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

const months = [
  { key: 'july', label: 'Июль' },
  { key: 'august', label: 'Август' },
  { key: 'september', label: 'Сентябрь' }
];

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

  const addTask = () => {
    if (newTask.task && newTask.competency) {
      const task: ActionItem = {
        priority: newTask.priority || 1,
        task: newTask.task,
        competency: newTask.competency,
        complexity: newTask.complexity || 1,
        july: newTask.july || false,
        august: newTask.august || false,
        september: newTask.september || false
      };
      
      updateData([...data, task]);
      setNewTask({
        priority: 1,
        task: '',
        competency: '',
        complexity: 1,
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
                <SelectTrigger>
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
                <SelectTrigger>
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
                <SelectTrigger>
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
            <div className="flex space-x-4 mt-2">
              {months.map(month => (
                <label key={month.key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={newTask[month.key as keyof ActionItem] as boolean || false}
                    onCheckedChange={(checked) => setNewTask({ ...newTask, [month.key]: checked })}
                  />
                  <span className="text-sm">{month.label}</span>
                </label>
              ))}
            </div>
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
                    
                    <div className="flex items-center space-x-4">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div className="flex space-x-2">
                        {months.map(month => (
                          <Badge 
                            key={month.key}
                            className={task[month.key as keyof ActionItem] ? 'bg-blue-500' : 'bg-gray-300'}
                          >
                            {month.label}
                          </Badge>
                        ))}
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