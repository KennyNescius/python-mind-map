import { Edge, Node } from '@xyflow/react';

export type Concept = {
  id: string;
  title: string;
  shortDesc: string;
  content: string;
};

export const pythonNodes: Node[] = [
  {
    id: 'start',
    type: 'customNode',
    position: { x: 0, y: 0 },
    data: { title: 'Основы Python', desc: 'С чего начинается путь', category: 'core' },
  },
  {
    id: 'types',
    type: 'customNode',
    position: { x: -350, y: 0 },
    data: { title: 'Типы данных и Переменные', desc: 'Базовые кирпичики', category: 'types' },
  },
  {
    id: 'numbers',
    type: 'customNode',
    position: { x: -650, y: -100 },
    data: { title: 'Числа', desc: 'int, float, complex', category: 'types' },
  },
  {
    id: 'strings',
    type: 'customNode',
    position: { x: -650, y: 0 },
    data: { title: 'Строки', desc: 'Текст (str)', category: 'types' },
  },
  {
    id: 'booleans',
    type: 'customNode',
    position: { x: -650, y: 100 },
    data: { title: 'Логические', desc: 'True / False (bool)', category: 'types' },
  },
  {
    id: 'collections',
    type: 'customNode',
    position: { x: 350, y: 0 },
    data: { title: 'Коллекции', desc: 'Хранение данных', category: 'collections' },
  },
  {
    id: 'lists',
    type: 'customNode',
    position: { x: 650, y: -100 },
    data: { title: 'Списки', desc: 'Упорядоченные массивы (list)', category: 'collections' },
  },
  {
    id: 'dicts',
    type: 'customNode',
    position: { x: 650, y: 0 },
    data: { title: 'Словари', desc: 'Ключ-Значение (dict)', category: 'collections' },
  },
  {
    id: 'tuples',
    type: 'customNode',
    position: { x: 650, y: 100 },
    data: { title: 'Кортежи', desc: 'Неизменяемые списки (tuple)', category: 'collections' },
  },
  {
    id: 'control',
    type: 'customNode',
    position: { x: 0, y: -250 },
    data: { title: 'Управление потоком', desc: 'Ветвления и циклы', category: 'control' },
  },
  {
    id: 'if_else',
    type: 'customNode',
    position: { x: -150, y: -450 },
    data: { title: 'Условия (if/else)', desc: 'Выбор пути', category: 'control' },
  },
  {
    id: 'loops',
    type: 'customNode',
    position: { x: 150, y: -450 },
    data: { title: 'Циклы (for/while)', desc: 'Повторение действий', category: 'control' },
  },
  {
    id: 'functions',
    type: 'customNode',
    position: { x: 0, y: 250 },
    data: { title: 'Функции', desc: 'Повторно используемый код', category: 'functions' },
  },
  {
    id: 'def',
    type: 'customNode',
    position: { x: -150, y: 450 },
    data: { title: 'Определение (def)', desc: 'Создание своих функций', category: 'functions' },
  },
  {
    id: 'lambda',
    type: 'customNode',
    position: { x: 150, y: 450 },
    data: { title: 'Lambda функции', desc: 'Анонимные функции', category: 'functions' },
  },
  // --- New Types Node ---
  { id: 'none', type: 'customNode', position: { x: -650, y: 200 }, data: { title: 'NoneType', desc: 'Ничего (None)', category: 'types' } },
  { id: 'typing', type: 'customNode', position: { x: -650, y: 300 }, data: { title: 'Типизация', desc: 'Type Hinting', category: 'types' } },
  
  // --- New Collections Node ---
  { id: 'sets', type: 'customNode', position: { x: 650, y: 200 }, data: { title: 'Множества', desc: 'Уникальные элементы (set)', category: 'collections' } },
  
  // --- New Control Node ---
  { id: 'match', type: 'customNode', position: { x: 0, y: -450 }, data: { title: 'Match-Case', desc: 'Сопоставление шаблонов', category: 'control' } },
  { id: 'async', type: 'customNode', position: { x: 300, y: -450 }, data: { title: 'Асинхронность', desc: 'async / await', category: 'control' } },
  
  // --- New Functions Node ---
  { id: 'decorators', type: 'customNode', position: { x: 300, y: 450 }, data: { title: 'Декораторы', desc: 'Обертки для функций (@)', category: 'functions' } },
  { id: 'generators', type: 'customNode', position: { x: -300, y: 450 }, data: { title: 'Генераторы', desc: 'yield и Итераторы', category: 'functions' } },

  // --- OOP Branch ---
  { id: 'oop', type: 'customNode', position: { x: -300, y: -250 }, data: { title: 'ООП', desc: 'Объекты и классы', category: 'oop' } },
  { id: 'classes', type: 'customNode', position: { x: -450, y: -400 }, data: { title: 'Классы (class)', desc: 'Шаблоны объектов', category: 'oop' } },
  { id: 'methods', type: 'customNode', position: { x: -500, y: -250 }, data: { title: 'Методы (self)', desc: 'Функции внутри классов', category: 'oop' } },
  { id: 'inheritance', type: 'customNode', position: { x: -300, y: -450 }, data: { title: 'Наследование', desc: 'Переиспользование классов', category: 'oop' } },

  // --- Modules Branch ---
  { id: 'modules', type: 'customNode', position: { x: 300, y: -250 }, data: { title: 'Модули', desc: 'Организация кода', category: 'modules' } },
  { id: 'import', type: 'customNode', position: { x: 450, y: -400 }, data: { title: 'Импорт (import)', desc: 'Подключение чужого кода', category: 'modules' } },
  { id: 'pip', type: 'customNode', position: { x: 500, y: -250 }, data: { title: 'Менеджер pip', desc: 'Сторонние библиотеки', category: 'modules' } },
  { id: 'packages', type: 'customNode', position: { x: 300, y: -450 }, data: { title: 'Пакеты', desc: 'Множество модулей', category: 'modules' } },
  { id: 'venv', type: 'customNode', position: { x: 650, y: -250 }, data: { title: 'Виртуальное окружение', desc: 'Изоляция (venv)', category: 'modules' } },
  { id: 'testing', type: 'customNode', position: { x: 500, y: -100 }, data: { title: 'Тестирование', desc: 'pytest / unittest', category: 'modules' } },

  // --- Errors Branch ---
  { id: 'errors', type: 'customNode', position: { x: -300, y: 250 }, data: { title: 'Ошибки', desc: 'Обработка исключений', category: 'errors' } },
  { id: 'try_except', type: 'customNode', position: { x: -450, y: 400 }, data: { title: 'Try / Except', desc: 'Ловля ошибок', category: 'errors' } },
  { id: 'raise', type: 'customNode', position: { x: -500, y: 250 }, data: { title: 'Вызов (raise)', desc: 'Ручной выброс ошибок', category: 'errors' } },
  { id: 'finally', type: 'customNode', position: { x: -300, y: 450 }, data: { title: 'Finally / Else', desc: 'Дополнительные блоки', category: 'errors' } },

  // --- Files Branch ---
  { id: 'files', type: 'customNode', position: { x: 300, y: 250 }, data: { title: 'Файлы', desc: 'Работа с системой', category: 'files' } },
  { id: 'read_write', type: 'customNode', position: { x: 450, y: 400 }, data: { title: 'Чтение / Запись', desc: 'Функция open()', category: 'files' } },
  { id: 'context_mgrs', type: 'customNode', position: { x: 500, y: 250 }, data: { title: 'Контекст (with)', desc: 'Менеджеры контекста', category: 'files' } },
  { id: 'json', type: 'customNode', position: { x: 300, y: 450 }, data: { title: 'JSON', desc: 'Формат обмена данными', category: 'files' } },
];

export const pythonEdges: Edge[] = [
  { id: 'e-start-types', source: 'start', target: 'types', animated: true },
  { id: 'e-start-collections', source: 'start', target: 'collections', animated: true },
  { id: 'e-types-numbers', source: 'types', target: 'numbers' },
  { id: 'e-types-strings', source: 'types', target: 'strings' },
  { id: 'e-types-booleans', source: 'types', target: 'booleans' },
  { id: 'e-collections-lists', source: 'collections', target: 'lists' },
  { id: 'e-collections-dicts', source: 'collections', target: 'dicts' },
  { id: 'e-collections-tuples', source: 'collections', target: 'tuples' },
  { id: 'e-start-control', source: 'start', target: 'control', animated: true },
  { id: 'e-control-if', source: 'control', target: 'if_else' },
  { id: 'e-control-loops', source: 'control', target: 'loops' },
  { id: 'e-start-functions', source: 'start', target: 'functions', animated: true },
  { id: 'e-func-def', source: 'functions', target: 'def' },
  { id: 'e-func-lambda', source: 'functions', target: 'lambda' },
  // New single edges
  { id: 'e-types-none', source: 'types', target: 'none' },
  { id: 'e-types-typing', source: 'types', target: 'typing' },
  { id: 'e-collections-sets', source: 'collections', target: 'sets' },
  { id: 'e-control-match', source: 'control', target: 'match' },
  { id: 'e-control-async', source: 'control', target: 'async' },
  { id: 'e-func-decorators', source: 'functions', target: 'decorators' },
  { id: 'e-func-generators', source: 'functions', target: 'generators' },

  // OOP
  { id: 'e-start-oop', source: 'start', target: 'oop', animated: true },
  { id: 'e-oop-classes', source: 'oop', target: 'classes' },
  { id: 'e-oop-methods', source: 'oop', target: 'methods' },
  { id: 'e-oop-inheritance', source: 'oop', target: 'inheritance' },

  // Modules
  { id: 'e-start-modules', source: 'start', target: 'modules', animated: true },
  { id: 'e-modules-import', source: 'modules', target: 'import' },
  { id: 'e-modules-pip', source: 'modules', target: 'pip' },
  { id: 'e-modules-packages', source: 'modules', target: 'packages' },
  { id: 'e-modules-venv', source: 'modules', target: 'venv' },
  { id: 'e-modules-testing', source: 'modules', target: 'testing' },

  // Errors
  { id: 'e-start-errors', source: 'start', target: 'errors', animated: true },
  { id: 'e-errors-try', source: 'errors', target: 'try_except' },
  { id: 'e-errors-raise', source: 'errors', target: 'raise' },
  { id: 'e-errors-finally', source: 'errors', target: 'finally' },

  // Files
  { id: 'e-start-files', source: 'start', target: 'files', animated: true },
  { id: 'e-files-rw', source: 'files', target: 'read_write' },
  { id: 'e-files-with', source: 'files', target: 'context_mgrs' },
  { id: 'e-files-json', source: 'files', target: 'json' },
];

export const conceptDetails: Record<string, Concept> = {
  start: {
    id: 'start',
    title: 'Основы Python',
    shortDesc: 'Краткое введение',
    content: `
# Добро пожаловать в Python!

**Python** — это высокоуровневый язык программирования, который легко читать и писать. 

Самая первая программа, которую пишут все разработчики:
\`\`\`python
print("Hello, World!")
\`\`\`

## Особенности:
- Строгая, динамическая типизация.
- Блоки кода определяются отступами (пробелами/табами).
- Богатая стандартная библиотека.

Кликни по любому узлу на карте, чтобы узнать больше!
    `,
  },
  types: {
    id: 'types',
    title: 'Типы данных и Переменные',
    shortDesc: 'Основа хранения информации',
    content: `
# Переменные и Типы Данных

Переменные создаются в момент присвоения им значения. Писать тип данных не нужно, Python определит его сам.

\`\`\`python
age = 25          # Целое число (int)
name = "Alice"    # Строка (str)
pi = 3.14         # Вещественное число (float)
is_active = True  # Логический тип (bool)
\`\`\`

Python — язык с **динамической типизацией**, поэтому вы можете легко переназначить тип:
\`\`\`python
x = 10
x = "Теперь я строка" # Это сработает без ошибок
\`\`\`
    `,
  },
  numbers: {
    id: 'numbers',
    title: 'Числа',
    shortDesc: 'Математика в Python',
    content: `
# Числа в Python

Python поддерживает несколько числовых типов:
1. **int** — целые числа (могут быть любой длины)
2. **float** — десятичные дроби (числа с плавающей точкой)
3. **complex** — комплексные числа (например, \`1 + 2j\`)

## Операции:
\`\`\`python
a = 10
b = 3

print(a + b)  # Сложение -> 13
print(a - b)  # Вычитание -> 7
print(a * b)  # Умножение -> 30
print(a / b)  # Нормальное деление -> 3.3333333333333335
print(a // b) # Целочисленное деление -> 3
print(a % b)  # Остаток от деления -> 1
print(a ** b) # Возведение в степень -> 1000
\`\`\`
    `,
  },
  strings: {
    id: 'strings',
    title: 'Строки',
    shortDesc: 'Работа с текстом',
    content: `
# Строки (Strings)

Строки в Python можно объявлять с помощью одинарных \`'\` или двойных \`"\` кавычек.

\`\`\`python
text = "Привет, мир!"
\`\`\`

## Полезные методы строк:
\`\`\`python
s = "  Python Awesome  "
print(s.upper())      # "  PYTHON AWESOME  "
print(s.lower())      # "  python awesome  "
print(s.strip())      # "Python Awesome" (убирает пробелы по краям)
print(len(s))         # Узнать длину строки - 18
\`\`\`

## f-строки (Форматирование):
Очень удобный способ вставки переменных прямо в строку:
\`\`\`python
name = "Ivan"
age = 20
print(f"Меня зовут {name} и мне {age} лет.")
\`\`\`
    `,
  },
  booleans: {
    id: 'booleans',
    title: 'Логические типы',
    shortDesc: 'Правда или Ложь',
    content: `
# Логические типы (Booleans)

Всего два значения: **True** (истина) и **False** (ложь). Обязательно пишутся с большой буквы!

\`\`\`python
is_admin = True
is_logged_in = False
\`\`\`

## Логические операторы:
\`\`\`python
x = True
y = False

print(x and y) # Логическое И (False)
print(x or y)  # Логическое ИЛИ (True)
print(not x)   # Логическое НЕ (False)
\`\`\`

## Операторы сравнения:
\`\`\`python
print(5 > 3)   # True
print(5 == 5)  # True (равно)
print(5 != 3)  # True (не равно)
\`\`\`
    `,
  },
  collections: {
    id: 'collections',
    title: 'Коллекции',
    shortDesc: 'Структуры данных',
    content: `
# Коллекции в Python

В Python встроено 4 основных типа для хранения наборов данных:

1. **Списки (List)** — упорядоченные, изменяемые, допускают дубликаты.
2. **Кортежи (Tuple)** — упорядоченные, НЕизменяемые, допускают дубликаты.
3. **Словари (Dictionary)** — упорядоченные (с версии 3.7), изменяемые, хранят пары "ключ: значение".
4. **Множества (Set)** — неупорядоченные, изменяемые, НЕ допускают дубликатов.
    `,
  },
  lists: {
    id: 'lists',
    title: 'Списки (List)',
    shortDesc: 'Универсальный массив',
    content: `
# Списки (Lists)
Списки создаются с помощью квадратных скобок \`[]\`. В них можно хранить данные разных типов.

\`\`\`python
fruits = ["яблоко", "банан", "вишня"]

print(fruits[0])  # Обращение по индексу -> "яблоко"
print(fruits[-1]) # Последний элемент -> "вишня"
\`\`\`

## Основные методы:
\`\`\`python
fruits.append("апельсин")  # Добавить в конец
fruits.insert(1, "киви")   # Вставить на 1-ю позицию
fruits.remove("банан")     # Удалить по значению
popped = fruits.pop()      # Удалить и вернуть последний элемент
\`\`\`

## Срезы (Slicing):
\`\`\`python
nums = [0, 1, 2, 3, 4, 5, 6]
print(nums[1:4])  # [1, 2, 3] (от 1 до 4, не включая 4)
print(nums[::-1]) # [6, 5, 4, 3, 2, 1, 0] (Развернуть список)
\`\`\`
    `,
  },
  dicts: {
    id: 'dicts',
    title: 'Словари (Dictionary)',
    shortDesc: 'Хранение пар ключ-значение',
    content: `
# Словари (Dictionaries)

Словари используются для хранения данных в виде пар \`Ключ: Значение\`. В качестве ключей обычно используют строки или числа.

\`\`\`python
user = {
  "name": "Алексей",
  "age": 30,
  "role": "admin"
}
\`\`\`

## Как работать:
\`\`\`python
print(user["name"])       # "Алексей"
user["age"] = 31          # Изменить значение
user["city"] = "Москва"   # Добавить новую пару

# Безопасное получение значения:
print(user.get("role"))   # "admin"
print(user.get("email"))  # None (ошибки не будет)
\`\`\`

## Методы словаря:
\`\`\`python
print(user.keys())    # Получить все ключи
print(user.values())  # Получить все значения
print(user.items())   # Получить пары
\`\`\`
    `,
  },
  tuples: {
    id: 'tuples',
    title: 'Кортежи (Tuple)',
    shortDesc: 'Неизменяемые списки',
    content: `
# Кортежи (Tuples)

Кортежи похожи на списки, но они **неизменяемы**. Если вы создали кортеж, вы не можете изменить, добавить или удалить его элементы. Зато они работают быстрее списков.

Создаются с помощью круглых скобок \`()\`:
\`\`\`python
coordinates = (10, 20, 30)

print(coordinates[0]) # 10
\`\`\`

Попытка изменить элемент вызовет ошибку:
\`\`\`python
coordinates[0] = 15 # TypeError: 'tuple' object does not support item assignment
\`\`\`

Кортеж из одного элемента пишется с запятой:
\`\`\`python
single = ("один",)
\`\`\`
    `,
  },
  control: {
    id: 'control',
    title: 'Управление потоком',
    shortDesc: 'Ветвления и циклы',
    content: `
# Управление потоком

Без управления потоком программа будет всегда выполняться строго сверху вниз.
Благодаря условным конструкциям и циклам код может "ветвиться" и "повторяться" в зависимости от данных.

В Python для этого используются:
- \`if / elif / else\` для ветвления
- \`for\` и \`while\` для зацикливания
    `
  },
  if_else: {
    id: 'if_else',
    title: 'Условия (if/else)',
    shortDesc: 'Конструкция if-elif-else',
    content: `
# Условные конструкции (if, elif, else)

Python использует отступы для определения блоков кода.

\`\`\`python
age = 18

if age >= 18:
    print("Доступ разрешен")
elif age >= 16:
    print("Доступ с ограничениями")
else:
    print("Доступ запрещен")
\`\`\`

**Особенности:**
- В отличие от некоторых других языков, здесь нет фигурных скобок \`{}\`. 
- Слово \`elif\` - это сокращение от \`else if\`.
- Двоеточие \`:\` обязательно в конце строки с условием.
    `,
  },
  loops: {
    id: 'loops',
    title: 'Циклы (for / while)',
    shortDesc: 'Повторение блоков кода',
    content: `
# Циклы

## Цикл \`while\`
Выполняется, пока условие истинно:
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1
\`\`\`

## Цикл \`for\`
Обычно используется для перебора элементов (списков, строк, словарей, и т.д.):
\`\`\`python
fruits = ["яблоко", "банан", "вишня"]
for fruit in fruits:
    print(fruit)
\`\`\`

Часто используется с функцией \`range()\`, чтобы выполнить блок N раз:
\`\`\`python
for i in range(5): 
    # Выведет числа от 0 до 4
    print(i)
\`\`\`

## Операторы прерывания:
- \`break\` — преждевременно выходит из цикла целиком.
- \`continue\` — пропускает текущую итерацию и переходит к следующей.
    `
  },
  functions: {
    id: 'functions',
    title: 'Функции',
    shortDesc: 'Переиспользование кода',
    content: `
# Функции

Функции позволяют группировать блоки кода, чтобы вызывать их по мере необходимости. 
Это делает код чище и помогает избежать дублирования.

- Создаются с помощью \`def\`.
- Могут быть анонимными (lambda).
- Могут возвращать значения с помощью \`return\`.
    `
  },
  def: {
    id: 'def',
    title: 'Определение функции',
    shortDesc: 'Ключевое слово def',
    content: `
# Определение функций (def)

Создаем функцию:
\`\`\`python
def greet(name):
    # Тело функции содержит отступ
    return f"Привет, {name}!"

# Вызов функции:
result = greet("Аня")
print(result) # Выведет: Привет, Аня!
\`\`\`

## Значения по умолчанию
\`\`\`python
def power(base, exp=2):
    return base ** exp

print(power(3))    # 9 (3 в квадрате)
print(power(3, 3)) # 27 (3 в кубе)
\`\`\`

## Разнообразные аргументы (*args, **kwargs)
\`\`\`python
def summarize(*args):
    return sum(args)

print(summarize(1, 2, 3, 4, 5)) # 15
\`\`\`
    `,
  },
  lambda: {
    id: 'lambda',
    title: 'Lambda-функции',
    shortDesc: 'Анонимные функции',
    content: `
# Анонимные функции (lambda)

\`lambda\` позволяет создавать функции в одну строку без использования \`def\`.

Синтаксис: \`lambda аргументы: выражение\`

\`\`\`python
# Обычная функция
def square(x):
    return x ** 2

# Эквивалент с lambda
sq = lambda x: x ** 2
print(sq(5)) # 25
\`\`\`

Лямбда-функции часто используют там, где функция нужна на один раз. Например в сортировке:
\`\`\`python
points = [(1, 2), (3, 1), (5, -1)]

# Сортируем список по второму элементу кортежа
points.sort(key=lambda item: item[1])
print(points) # [(5, -1), (3, 1), (1, 2)]
\`\`\`
    `,
  },
  none: {
    id: 'none',
    title: 'Тип None (NoneType)',
    shortDesc: 'Отсутствие значения',
    content: `
# None (Пустота)

В Python \`None\` — это специальный тип данных (NoneType), который обозначает отсутствие какого-либо значения. Это аналог \`null\` в других языках.

\`\`\`python
user = None

if user is None:
    print("Пользователь не найден")
\`\`\`

## Особенности:
- Функция, которая ничего не возвращает через \`return\`, неявно возвращает \`None\`.
- При проверке \`None\` рекомендуется использовать оператор \`is\`, а не \`==\`.
    `
  },
  sets: {
    id: 'sets',
    title: 'Множества (Set)',
    shortDesc: 'Только уникальные',
    content: `
# Множества (Set)

Множество — это неупорядоченная коллекция **уникальных** элементов. Они очень эффективны для проверки принадлежности "входит ли элемент в набор".

Создаются с помощью фигурных скобок \`{}\` или функции \`set()\`:
\`\`\`python
unique_numbers = {1, 2, 3, 3, 3, 4}
print(unique_numbers) # {1, 2, 3, 4} (дубликаты исчезнут!)
\`\`\`

## Операции с множествами:
\`\`\`python
A = {1, 2, 3}
B = {3, 4, 5}

print(A | B) # Объединение -> {1, 2, 3, 4, 5}
print(A & B) # Пересечение -> {3}
print(A - B) # Разность -> {1, 2}
\`\`\`
    `
  },
  match: {
    id: 'match',
    title: 'Match-Case',
    shortDesc: 'Сопоставление шаблонов',
    content: `
# Match-Case (с версии 3.10)

\`match-case\` — это мощный механизм сопоставления с шаблоном (по сути очень умный \`switch-case\`).

\`\`\`python
command = "start"

match command:
    case "start":
        print("Запуск системы")
    case "stop":
        print("Остановка")
    case _:
        print("Неизвестная команда") # _ означает "все остальное"
\`\`\`

## Сложные шаблоны:
\`\`\`python
user = {"name": "Ivan", "role": "admin"}

match user:
    case {"role": "admin", "name": name}:
        print(f"Добро пожаловать, админ {name}!")
    case {"role": "user"}:
        print("Обычный доступ.")
    case _:
        print("Гость.")
\`\`\`
    `
  },
  decorators: {
    id: 'decorators',
    title: 'Декораторы',
    shortDesc: 'Обертки функций',
    content: `
# Декораторы

Декоратор — это функция, которая позволяет менять поведение другой функции, не изменяя ее код напрямую. Выглядит как символ \`@\` перед объявлением функции.

\`\`\`python
def my_decorator(func):
    def wrapper():
        print("Что-то делаем ДО вызова функции.")
        func()
        print("Что-то делаем ПОСЛЕ вызова функции.")
    return wrapper

@my_decorator
def say_hello():
    print("Привет!")

say_hello()
# Выведет:
# Что-то делаем ДО вызова функции.
# Привет!
# Что-то делаем ПОСЛЕ вызова функции.
\`\`\`
    `
  },
  oop: {
    id: 'oop',
    title: 'ООП',
    shortDesc: 'Объектно-ориентированно',
    content: `
# Объектно-ориентированное программирование

ООП в Python — это способ структурирования программ, когда свойства и поведение объединяются в отдельные сущности - **объекты**.

## Суть:
Мы конструируем мир из сущностей, которые взаимодействуют друг с другом. У каждого объекта есть **атрибуты** (состояние, данные) и **методы** (что он умеет делать).

Базовые концепции ООП:
1. **Инкапсуляция** (сокрытие внутренней реализации)
2. **Наследование** (переиспользование кода)
3. **Полиморфизм** (разные объекты могут реагировать на одну команду по-своему)
    `
  },
  classes: {
    id: 'classes',
    title: 'Классы',
    shortDesc: 'Шаблоны объектов',
    content: `
# Классы (class)

Класс — это "чертеж" (или шаблон) для создания объектов. Объект — это конкретный экземпляр, созданный по этому чертежу.

\`\`\`python
class Dog:
    # Метод __init__ - это конструктор. Он вызывается при создании объекта.
    def __init__(self, name, age):
        self.name = name  # Атрибут объекта
        self.age = age

# Создание объекта (экземпляра) по чертежу
my_dog = Dog("Бобик", 3)

print(my_dog.name) # Выведет: Бобик
\`\`\`
    `
  },
  methods: {
    id: 'methods',
    title: 'Методы и self',
    shortDesc: 'Поведение объектов',
    content: `
# Методы

**Метод** — это просто функция, которая принадлежит классу и работает с его объектами.

Первым аргументом любого стандартного метода всегда идет \`self\` — это ссылка на сам объект (он передается автоматически).

\`\`\`python
class Car:
    def __init__(self, color):
        self.color = color
        self.is_running = False

    def start_engine(self):
        self.is_running = True
        print("Вжжжж! Двигатель запущен.")

my_car = Car("Красный")
my_car.start_engine()
\`\`\`
    `
  },
  inheritance: {
    id: 'inheritance',
    title: 'Наследование',
    shortDesc: 'Дочерние классы',
    content: `
# Наследование

Наследование позволяет создать новый класс на основе уже существующего.
Так мы берем всё старое, и можем добавить к нему новое, не переписывая код родителя.

\`\`\`python
class Animal:
    def eat(self):
        print("Я кушаю")

# Класс Cat наследуется от Animal
class Cat(Animal):
    def meow(self):
        print("Мяу!")

barsik = Cat()
barsik.eat()  # Метод достался от родителя (Animal)
barsik.meow() # Собственный метод
\`\`\`
    `
  },
  modules: {
    id: 'modules',
    title: 'Модули',
    shortDesc: 'Организация кода',
    content: `
# Модули в Python

Любой текстовый файл с расширением \`.py\` — это уже **модуль**.
Вы можете писать код в одном файле и использовать его в другом. Это отличный способ не превращать программу в огромную нечитаемую портянку.

Python также поставляется с огромной **стандартной библиотекой** — кучей встроенных модулей (\`math\`, \`datetime\`, \`os\`, \`random\` и др.), которые готовы к использованию.
    `
  },
  import: {
    id: 'import',
    title: 'Импорт (import)',
    shortDesc: 'Как подключить',
    content: `
# Импорт кода (import)

Команда \`import\` используется, чтобы загрузить функции, классы или переменные из другого файла (или библиотеки) в ваш скрипт.

\`\`\`python
# Подключить весь модуль
import math
print(math.sqrt(16)) # 4.0

# Подключить только нужную функцию
from random import randint
print(randint(1, 10)) # Случайное число от 1 до 10

# Импорт с синонимом (алиасом)
import datetime as dt
print(dt.datetime.now())
\`\`\`
    `
  },
  pip: {
    id: 'pip',
    title: 'Менеджер pip',
    shortDesc: 'Установка библиотек',
    content: `
# pip (Python Package Installer)

\`pip\` — это программа (менеджер пакетов), которая позволяет устанавливать библиотеки от других разработчиков со всего мира (из реестра PyPI).

## Примеры команд терминала:
\`\`\`bash
# Установка библиотеки (например requests)
pip install requests

# Удаление библиотеки
pip uninstall requests

# Список установленных библиотек
pip list
\`\`\`

После установки вы можете использовать библиотеку через стандартный \`import requests\`.
    `
  },
  packages: {
    id: 'packages',
    title: 'Пакеты',
    shortDesc: 'Папки с модулями',
    content: `
# Пакеты (Packages)

Пакет — это просто директория (папка), которая содержит множество модулей (\`.py\` файлов) и (опционально) файл \`__init__.py\`, который говорит Питону, что эта папка — конфигурация пакета.

\`\`\`text
my_project/
  main.py
  utils/       <-- Пакет
    __init__.py
    math_tools.py
    string_tools.py
\`\`\`

Импорт модуля из вложенной папки:
\`\`\`python
from utils.math_tools import add_numbers
\`\`\`
    `
  },
  errors: {
    id: 'errors',
    title: 'Ошибки и Исключения',
    shortDesc: 'Защита от краша',
    content: `
# Исключения (Exceptions)

В процессе работы программы может пойти что-то не так:
- Попытка открыть несуществующий файл (FileNotFoundError)
- Деление на 0 (ZeroDivisionError)
- Сложение текста с числом (TypeError)

Если такую ошибку не перехватить, программа полностью "упадет" (завершится с ошибкой). Механизм исключений позволяет перехватить ошибку и отреагировать адекватно.
    `
  },
  try_except: {
    id: 'try_except',
    title: 'Try / Except',
    shortDesc: 'Ловля ошибок',
    content: `
# Конструкция Try / Except

Вы можете "попробовать" (\`try\`) выполнить код. Если он вызовет ошибку, вы поймаете ее в блоке \`except\`.

\`\`\`python
try:
    result = 10 / 0
except ZeroDivisionError:
    print("На ноль делить нельзя!")

print("Программа работает дальше без сбоев.")
\`\`\`

Можно ловить любые ошибки не уточняя тип (через базовый Exception):
\`\`\`python
try:
    x = int("Привет")
except Exception as e:
    print(f"Поймали ошибку: {e}")
\`\`\`
    `
  },
  raise: {
    id: 'raise',
    title: 'raise (Вызов ошибки)',
    shortDesc: 'Сгенерировать ошибку',
    content: `
# Оператор raise

Вы можете самостоятельно выбрасывать ошибки, если что-то идет не так по вашей логике (например, пришли плохие данные).

\`\`\`python
def set_age(age):
    if age < 0:
        raise ValueError("Возраст не может быть отрицательным!")
    return age

# Вызов функции с неверными данными сгенерирует ошибку
set_age(-5) 
# ValueError: Возраст не может быть отрицательным!
\`\`\`
    `
  },
  finally: {
    id: 'finally',
    title: 'Else и Finally',
    shortDesc: 'Окончание Try',
    content: `
# Блоки Else и Finally

Конструкцию Try/Except можно расширить дополнительной логикой:

\`\`\`python
try:
    file = open("data.txt", "r")
    # чтение данных...
except FileNotFoundError:
    print("Файл не найден!")
else:
    # Выполнится ТОЛЬКО если в try не было никаких ошибок
    print("Чтение успешно завершено.")
finally:
    # Выполнится вообще ВСЕГДА и при любых обстоятельствах
    # (часто пишут для закрытия открытых файлов или портов)
    print("Конец работы блока.")
\`\`\`
    `
  },
  files: {
    id: 'files',
    title: 'Файлы',
    shortDesc: 'Работа с файлами',
    content: `
# Работа с файловой системой

Программы на Python часто должны читать информацию с жесткого диска или сохранять её в файлы. Для базовой работы с файлами в Python есть встроенная функция \`open()\`.

Файлы бывают:
- **Текстовые** (читаемый текст - .txt, .json, .csv)
- **Бинарные** (байты данных - .jpg, .zip, .exe)
    `
  },
  read_write: {
    id: 'read_write',
    title: 'Чтение / Запись',
    shortDesc: 'Функция open()',
    content: `
# Открытие файлов

Для работы с файлами используется \`open(имя_файла, режим_работы)\`.

Базовые режимы:
- \`"r"\` (read) — чтение.
- \`"w"\` (write) — запись (полностью перезапишет файл).
- \`"a"\` (append) — дозапись (добавит новые строки в конец).

\`\`\`python
# Запись
file = open("hello.txt", "w", encoding="utf-8")
file.write("Привет из Питона!")
file.close() # Важно вручную закрыть файл!

# Чтение
file = open("hello.txt", "r", encoding="utf-8")
content = file.read()
print(content)
file.close()
\`\`\`
    `
  },
  context_mgrs: {
    id: 'context_mgrs',
    title: 'Менеджеры контекста',
    shortDesc: 'Ключевое слово with',
    content: `
# Менеджеры контекста (with)

Чтобы не забывать писать \`file.close()\`, в Питоне есть конструкция \`with\`. Она **автоматически** закрывает за собой файл (или другое соединение), даже если внутри произошла внезапная ошибка!

\`\`\`python
with open("hello.txt", "r", encoding="utf-8") as file:
    content = file.read()
    print(content)
    
# Относительно этого отступа (за границами блока with) 
# файл УЖЕ безопасно закрыт.
\`\`\`
Это самый правильный "Pythonic" способ работы с файлами.
    `
  },
  json: {
    id: 'json',
    title: 'Работа с JSON',
    shortDesc: 'Ключевой формат WEB',
    content: `
# JSON (JavaScript Object Notation)

JSON - это текстовый формат для обмена данными, на котором общается почти весь современный Интернет. Он синтаксически очень похож на словари (dict) и списки (list) в Python.

Python имеет встроенную библиотеку \`json\` для работы с ним.

\`\`\`python
import json

data = {
    "name": "Tom",
    "age": 28,
    "skills": ["Python", "Docker"]
}

# Превратить словарь Питона в JSON строку (dump string - dumps)
json_string = json.dumps(data) 

# Превратить JSON строку обратно в словарь Питона (load string - loads)
parsed_dict = json.loads(json_string) 

print(parsed_dict["name"]) # Вывод: Tom
\`\`\`
    `
  },
  typing: {
    id: 'typing',
    title: 'Типизация (Type Hinting)',
    shortDesc: 'Аннотации типов',
    content: `
# Типизация в Python

Несмотря на то, что Python язык с динамической типизацией, в современном коде принято использовать **аннотации типов**. Это не делает язык строго типизированным (интерпретатор не выдаст ошибку во время работы), но помогает редакторам кода (VS Code, PyCharm) и линтерам (например, mypy) находить ошибки до запуска программы.

\`\`\`python
def greet(name: str) -> str:
    return f"Привет, {name}"

age: int = 25
is_active: bool = True
\`\`\`

## Модуль typing

Для более сложных структур используется встроенный модуль \`typing\`.

\`\`\`python
from typing import List, Dict, Optional, Union

# Список чисел
scores: List[int] = [10, 20, 30]

# Словарь, где ключ - строка, а значение - число
config: Dict[str, int] = {"port": 8080}

# Функция, которая может вернуть строку или ничего (None)
def get_user(user_id: int) -> Optional[str]:
    if user_id == 1:
        return "Admin"
    return None
\`\`\`
    `
  },
  generators: {
    id: 'generators',
    title: 'Генераторы и Итераторы',
    shortDesc: 'yield (ленивые вычисления)',
    content: `
# Генераторы

Генераторы — это специальный вид функций, которые могут приостанавливать свое выполнение и возвращать промежуточный результат. Для этого используется ключевое слово \`yield\`.

Главный плюс генераторов: они **экономят память**. Вместо того чтобы сразу создавать огромный список в памяти, генератор вычисляет элементы "на лету" по одному.

\`\`\`python
def count_up_to(max_value):
    count = 1
    while count <= max_value:
        yield count # Возвращаем значение и ставим на паузу
        count += 1

# Использование
counter = count_up_to(5)
for number in counter:
    print(number) 
# Выведет 1 2 3 4 5
\`\`\`

## Генераторные выражения

Похоже на списковые включения (list comprehensions), но используются круглые скобки.

\`\`\`python
# Обычный список (сразу в памяти)
squares_list = [x**2 for x in range(1000000)] 

# Генератор (занимает минимум памяти)
squares_gen = (x**2 for x in range(1000000))
\`\`\`
    `
  },
  async: {
    id: 'async',
    title: 'Асинхронность (asyncio)',
    shortDesc: 'async / await',
    content: `
# Асинхронное программирование

Асинхронность позволяет вашей программе не блокироваться (не зависать) во время долгого ожидания, например, при скачивании файла из сети или запроса к базе данных. Пока одна задача "ждет", программа может выполнять другие полезные действия.

Для этого в Python используется ключевое слово \`async\` для определения корутин и \`await\` для ожидания результатов.

\`\`\`python
import asyncio

async def fetch_data():
    print("Начинаем скачивание...")
    # Симуляция долгой сетевой операции (2 секунды)
    await asyncio.sleep(2) 
    print("Скачивание завершено!")
    return {"data": 42}

async def main():
    print("Запуск программы")
    # await говорит: "подожди результат этой корутины"
    result = await fetch_data() 
    print(result)

# Запуск асинхронного цикла событий
asyncio.run(main())
\`\`\`

Модуль \`asyncio\` — это ядро асинхронной работы в стандартной библиотеке Python.
    `
  },
  testing: {
    id: 'testing',
    title: 'Тестирование',
    shortDesc: 'pytest / unittest',
    content: `
# Тестирование кода

Писать тесты — признак хорошего тона. Тесты проверяют, делает ли ваш код то, что от него ожидается, и защищают от поломок в будущем.

В Python есть встроенный модуль \`unittest\`, но стандартом де-факто в индустрии стал сторонний фреймворк **pytest**, потому что он намного удобней и лаконичней.

## Пример с pytest

Установка: \`pip install pytest\`

Представим, что у нас есть функция:
\`\`\`python
# файл math_tools.py
def add(a, b):
    return a + b
\`\`\`

Мы создаем файл для тестов \`test_math_tools.py\`:
\`\`\`python
from math_tools import add

def test_add_positive():
    assert add(2, 3) == 5

def test_add_negative():
    assert add(-1, -1) == -2
\`\`\`

Запуск через терминал: \`pytest\`. Фреймворк сам найдет все файлы с префиксом \`test_\`, выполнит в них функции и покажет зеленый или красный статус!
    `
  },
  venv: {
    id: 'venv',
    title: 'Виртуальное окружение',
    shortDesc: 'Изоляция проектов (venv)',
    content: `
# Виртуальное окружение (Virtual Environment)

Представьте, что у вас есть Проект А, которому нужна библиотека \`requests\` версии 1.0. И Проект Б, которому нужна та же библиотека, но обязательно версии 2.0. Если ставить всё глобально на компьютер — будет конфликт.

Виртуальное окружение решает эту проблему — оно создает **отдельную изолированную песочницу** (со своим pip и библиотеками) для каждого проекта.

Встроенный модуль для этого — \`venv\`.

## Как это работает?

1. Перейдите в папку вашего проекта в терминале.
2. Создайте окружение (оно появится в скрытой папке \`.venv\`):
   \`\`\`bash
   python -m venv .venv
   \`\`\`
3. Активируйте его:
   - **Windows:** \`.venv\\Scripts\\activate\`
   - **MacOS/Linux:** \`source .venv/bin/activate\`
4. Устанавливайте пакеты:
   \`\`\`bash
   pip install requests
   \`\`\`
Теперь этот модуль установлен **только** в папке вашего проекта!
    `
  }
};
