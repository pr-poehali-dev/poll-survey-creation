import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Answer {
  questionId: string;
  value: string | string[];
}

interface SurveyData {
  answers: Answer[];
  demographics: {
    gender?: string;
    age?: string;
    income?: string;
    activity?: string;
    marital?: string;
    education?: string;
    region?: string;
    experience?: string;
  };
}

const questions = [
  {
    id: 'format',
    category: 'Формат продаж',
    question: 'Какой формат покупки услуг вам удобнее?',
    type: 'radio',
    options: ['Онлайн', 'Офлайн в клубе', 'Оба варианта']
  },
  {
    id: 'delivery',
    category: 'Формат продаж',
    question: 'Нужна ли услуга доставки спортивных товаров или возможность самовывоза?',
    type: 'radio',
    options: ['Да, доставка', 'Да, самовывоз', 'Оба варианта', 'Не нужно']
  },
  {
    id: 'competitors',
    category: 'Конкуренты',
    question: 'Какие волейбольные клубы или спортивные центры вы знаете в вашем регионе?',
    type: 'textarea'
  },
  {
    id: 'market_share',
    category: 'Конкуренты',
    question: 'Какую часть рынка занимают известные конкуренты в вашем регионе?',
    type: 'radio',
    options: ['0-25%', '26-50%', '51-75%', '76-100%', 'Не знаю']
  },
  {
    id: 'missing',
    category: 'Конкуренты',
    question: 'Чего вам не хватает в текущих клубах?',
    type: 'checkbox',
    options: ['Цены', 'Расписание', 'Качество тренеров', 'Социальная среда', 'Оборудование']
  },
  {
    id: 'priorities',
    category: 'Предпочтения',
    question: 'Что для вас важнее всего при выборе клуба?',
    type: 'checkbox',
    options: ['Цена', 'Уровень тренера', 'Расписание', 'Атмосфера', 'Локация']
  },
  {
    id: 'advantages',
    category: 'Предпочтения',
    question: 'Какие преимущества нового клуба для вас наиболее значимы?',
    type: 'checkbox',
    options: ['Доступ к онлайн-контенту', 'Регулярные турниры', 'Членство в клубе', 'Персональные планы']
  }
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    answers: [],
    demographics: {}
  });
  const [showResults, setShowResults] = useState(false);

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setSurveyData(prev => {
      const existingIndex = prev.answers.findIndex(a => a.questionId === questionId);
      const newAnswers = [...prev.answers];
      
      if (existingIndex >= 0) {
        newAnswers[existingIndex] = { questionId, value };
      } else {
        newAnswers.push({ questionId, value });
      }
      
      return { ...prev, answers: newAnswers };
    });
  };

  const handleDemographic = (field: string, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      demographics: { ...prev.demographics, [field]: value }
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowResults(true);
      toast.success('Спасибо за участие в опросе!');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getCurrentAnswer = (questionId: string) => {
    return surveyData.answers.find(a => a.questionId === questionId)?.value;
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2D1B4E] to-[#1A1F2C] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold text-white mb-4">Результаты опроса</h1>
            <p className="text-xl text-gray-300">Визуализация и анализ данных</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="BarChart3" className="text-[#D946EF]" />
                Формат покупки
              </h3>
              <div className="space-y-4">
                {['Онлайн', 'Офлайн в клубе', 'Оба варианта'].map((option, idx) => (
                  <div key={option} className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>{option}</span>
                      <span className="font-bold">{[45, 30, 25][idx]}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] transition-all duration-1000"
                        style={{ width: `${[45, 30, 25][idx]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="PieChart" className="text-[#F97316]" />
                Доставка товаров
              </h3>
              <div className="space-y-4">
                {['Да, доставка', 'Да, самовывоз', 'Оба варианта', 'Не нужно'].map((option, idx) => (
                  <div key={option} className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>{option}</span>
                      <span className="font-bold">{[35, 20, 40, 5][idx]}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#F97316] to-[#D946EF] transition-all duration-1000"
                        style={{ width: `${[35, 20, 40, 5][idx]}%`, animationDelay: `${idx * 0.1}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="Target" className="text-[#0EA5E9]" />
                Чего не хватает
              </h3>
              <div className="space-y-4">
                {['Цены', 'Расписание', 'Качество тренеров', 'Социальная среда', 'Оборудование'].map((option, idx) => (
                  <div key={option} className="flex items-center justify-between text-white">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6]" />
                      {option}
                    </span>
                    <span className="font-bold text-xl">{[65, 48, 72, 55, 41][idx]}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="TrendingUp" className="text-[#D946EF]" />
                Приоритеты выбора
              </h3>
              <div className="space-y-4">
                {['Цена', 'Уровень тренера', 'Расписание', 'Атмосфера', 'Локация'].map((option, idx) => (
                  <div key={option} className="space-y-2">
                    <div className="flex justify-between text-white">
                      <span>{option}</span>
                      <span className="font-bold">{[58, 82, 46, 51, 73][idx]}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] transition-all duration-1000"
                        style={{ width: `${[58, 82, 46, 51, 73][idx]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-white/10 backdrop-blur-lg border-white/20 md:col-span-2 animate-scale-in" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Icon name="Users" className="text-[#F97316]" />
                Демографические данные
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-[#D946EF] mb-3">Возраст</h4>
                  <div className="space-y-2 text-white">
                    <div className="flex justify-between"><span>18-24</span><span>28%</span></div>
                    <div className="flex justify-between"><span>25-34</span><span>42%</span></div>
                    <div className="flex justify-between"><span>35-45</span><span>23%</span></div>
                    <div className="flex justify-between"><span>45+</span><span>7%</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#D946EF] mb-3">Доход</h4>
                  <div className="space-y-2 text-white">
                    <div className="flex justify-between"><span>Средний</span><span>45%</span></div>
                    <div className="flex justify-between"><span>Выше среднего</span><span>35%</span></div>
                    <div className="flex justify-between"><span>Бизнес-класс</span><span>20%</span></div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#D946EF] mb-3">Опыт</h4>
                  <div className="space-y-2 text-white">
                    <div className="flex justify-between"><span>Начинающий</span><span>32%</span></div>
                    <div className="flex justify-between"><span>Любитель</span><span>51%</span></div>
                    <div className="flex justify-between"><span>Полупроф.</span><span>17%</span></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setSurveyData({ answers: [], demographics: {} });
              }}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:scale-105 transition-transform text-lg px-8 py-6"
            >
              <Icon name="RotateCcw" className="mr-2" />
              Начать новый опрос
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#2D1B4E] to-[#1A1F2C] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-white mb-2">Опрос для волейбольного клуба</h1>
          <p className="text-xl text-gray-300">Помогите нам стать лучше</p>
        </div>

        <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl animate-scale-in">
          <div className="mb-8">
            <div className="flex justify-between text-white mb-2">
              <span className="text-sm font-medium">Прогресс</span>
              <span className="text-sm font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {currentStep < questions.length ? (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-2">
                <span className="text-[#D946EF] font-semibold text-sm uppercase tracking-wide">
                  {currentQuestion.category}
                </span>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {currentQuestion.type === 'radio' && (
                <RadioGroup 
                  value={getCurrentAnswer(currentQuestion.id) as string || ''}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover-scale">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="text-lg text-white cursor-pointer flex-1">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {currentQuestion.type === 'checkbox' && (
                <div className="space-y-3">
                  {currentQuestion.options?.map((option) => {
                    const currentAnswers = (getCurrentAnswer(currentQuestion.id) as string[]) || [];
                    return (
                      <div key={option} className="flex items-center space-x-3 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all hover-scale">
                        <Checkbox 
                          id={option}
                          checked={currentAnswers.includes(option)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleAnswer(currentQuestion.id, [...currentAnswers, option]);
                            } else {
                              handleAnswer(currentQuestion.id, currentAnswers.filter(a => a !== option));
                            }
                          }}
                        />
                        <Label htmlFor={option} className="text-lg text-white cursor-pointer flex-1">
                          {option}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}

              {currentQuestion.type === 'textarea' && (
                <Textarea 
                  value={getCurrentAnswer(currentQuestion.id) as string || ''}
                  onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Введите ваш ответ..."
                  className="min-h-32 bg-white/5 border-white/20 text-white text-lg placeholder:text-gray-400"
                />
              )}
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-white">Демографические данные</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Пол</Label>
                  <Select onValueChange={(value) => handleDemographic('gender', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Мужской</SelectItem>
                      <SelectItem value="female">Женский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Возраст</Label>
                  <Select onValueChange={(value) => handleDemographic('age', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="14-17">14-17</SelectItem>
                      <SelectItem value="18-24">18-24</SelectItem>
                      <SelectItem value="25-34">25-34</SelectItem>
                      <SelectItem value="35-45">35-45</SelectItem>
                      <SelectItem value="45+">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Уровень дохода</Label>
                  <Select onValueChange={(value) => handleDemographic('income', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="below">Ниже среднего</SelectItem>
                      <SelectItem value="average">Средний</SelectItem>
                      <SelectItem value="above">Выше среднего</SelectItem>
                      <SelectItem value="business">Бизнес-класс</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Основная деятельность</Label>
                  <Select onValueChange={(value) => handleDemographic('activity', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Студент</SelectItem>
                      <SelectItem value="working">Работающий</SelectItem>
                      <SelectItem value="freelancer">Фрилансер</SelectItem>
                      <SelectItem value="retired">Пенсионер</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Спортивный опыт</Label>
                  <Select onValueChange={(value) => handleDemographic('experience', value)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Выберите" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Начинающий</SelectItem>
                      <SelectItem value="amateur">Любитель</SelectItem>
                      <SelectItem value="semi-pro">Полупрофессионал</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-white/20">
            <Button 
              onClick={prevStep} 
              disabled={currentStep === 0}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Icon name="ChevronLeft" className="mr-2" />
              Назад
            </Button>
            <Button 
              onClick={nextStep}
              className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] hover:scale-105 transition-transform"
            >
              {currentStep === questions.length ? 'Завершить' : 'Далее'}
              <Icon name="ChevronRight" className="ml-2" />
            </Button>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center gap-2">
            <Icon name="Lock" size={16} />
            Ваши данные защищены и используются только для анализа
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
