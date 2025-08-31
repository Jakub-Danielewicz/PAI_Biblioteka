# PAI_Biblioteka
**Projekt zaliczeniowy - System zarządzania biblioteką**

## 📖 Opis projektu

Biblioteka to system zarządzania biblioteką zbudowany jako aplikacja przeglądarkowa. System umożliwia użytkownikom przeglądanie katalogu książek, wypożyczanie ich, dodawanie recenzji oraz zarządzanie osobistymi kolekcjami ulubionych pozycji. Administratorzy posiadają pełne uprawnienia do zarządzania książkami, użytkownikami i wypożyczeniami.

## ⚡ Funkcjonalności

### 👤 **Dla użytkowników:**
- **Rejestracja i logowanie** - Bezpieczna autoryzacja JWT
- **Przeglądanie katalogu książek** - Interaktywna lista z opcją filtrowania i wyszukiwania
- **Szczegółowe informacje o książkach** - Wyświetlanie autora, opisu, wydawnictwa, roku wydania i ocen
- **Rezerwowanie i wypożyczanie książek** - Wybór terminu zwrotu (do 30 dni) dla wersji papierowych
- **Historia wypożyczeń** - Pełny przegląd aktywnych i zakończonych wypożyczeń
- **Przedłużanie wypożyczeń** - Możliwość przedłużenia terminu zwrotu (do 60 dni od wypożyczenia)
- **Zarządzanie ulubionymi** - Osobista kolekcja ulubionych książek i własne półki
- **System recenzji i ocen** - Dodawanie opinii i ocen (1-5 gwiazdek) do książek
- **Filtrowanie ocen** - Przeglądanie recenzji według liczby gwiazdek
- **Wyświetlanie opinii** - Czytanie recenzji i komentarzy innych użytkowników
- **Panel użytkownika** - Historia wypożyczeń, zarządzanie profilem, zmiana danych
- **Usuwanie konta** - Możliwość samodzielnego usunięcia konta użytkownika
 

### 🔑 **Dla administratora:**
- **Panel administracyjny** - Dedykowany interfejs do zarządzania całym systemem biblioteki
- **Zarządzanie książkami** - Dodawanie, edytowanie, usuwanie książek z katalogu
- **Zarządzanie egzemplarzami** - Kontrola dostępności poszczególnych kopii (papierowe/cyfrowe)
- **Zarządzanie użytkownikami** - Przeglądanie, dodawanie, usuwanie kont użytkowników
- **Monitoring wypożyczeń** - Przegląd  wszystkich aktywnych i historycznych wypożyczeń
- **Zarządzanie zasobami biblioteki** - Pełna kontrola nad katalogiem i dostępnością

## 🛠 Technologie

### **Backend:**
- **Node.js** + **Express.js** - Serwer aplikacji
- **SQLite** + **Sequelize ORM** - Baza danych z relacjami
- **JWT** - Autoryzacja i uwierzytelnianie
- **bcryptjs** - Szyfrowanie haseł
- **CORS** - Obsługa Cross-Origin Resource Sharing

### **Frontend:**
- **React 18** + **TypeScript** - Interfejs użytkownika
- **React Router** - Nawigacja 
- **Tailwind CSS** - Stylowanie i responsywność
- **Framer Motion** - Animacje
- **Heroicons** - Zestaw ikon
- **Axios** - Komunikacja HTTP

## 🚀 Instalacja i uruchomienie

### **Wymagania:**
- Node.js (wersja 16 lub nowsza)
- npm lub yarn

### **Backend:**
```bash
cd backend
npm install
npm run dev
```
Serwer będzie dostępny pod adresem: `http://localhost:3001`

**Uwaga:** Projekt zawiera gotową bazę danych SQLite (`database.sqlite`) z przykładowymi danymi testowymi, w tym:
- 8 książek z opisami
- 3 użytkowników testowych
- Przykładowe wypożyczenia (w tym przeterminowane)
- Recenzje i ulubione książki

W razie potrzeby można zregenerować dane testowe poleceniem:
```bash
npm run seed
```

### **Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

## 🔐 Panel administratora

### **Dostęp:**
Panel administratora jest dostępny dla użytkowników z uprawnieniami administratora.

**Dane dostępowe administratora:**
- **Email:** `admin@admin.pl`
- **Hasło:** `admin123`

Po zalogowaniu się na konto administratora, użytkownik zostanie automatycznie przekierowany na adres `/adminPanel`.

### **Funkcjonalności panelu:**
- **Książki** - CRUD operacje na książkach
- **Egzemplarze** - Zarządzanie kopiami książek
- **Wypożyczenia** - Monitoring wszystkich wypożyczeń w systemie
- **Użytkownicy** - Zarządzanie kontami użytkowników

## 🌐 API Endpoints

Wszystkie endpointy używają prefiksu `/api` i wymagają tokenu JWT (oprócz publicznych).

### **🔓 Publiczne (bez autoryzacji):**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/auth/register` | Rejestracja nowego użytkownika |
| `POST` | `/api/auth/login` | Logowanie użytkownika |

### **🔒 Chronione (wymagają JWT):**

#### **Książki i recenzje:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/books` | Lista wszystkich książek |
| `GET` | `/api/books/:ISBN_13` | Szczegóły konkretnej książki |
| `GET` | `/api/books/:ISBN_13/copies` | Lista egzemplarzy książki |
| `GET` | `/api/reviews/:bookId` | Recenzje dla konkretnej książki |

#### **Użytkownicy:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `PUT` | `/api/user` | Aktualizacja danych użytkownika |
| `DELETE` | `/api/user` | Usunięcie własnego konta |

#### **Wypożyczenia:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/borrows` | Lista wypożyczeń użytkownika |
| `POST` | `/api/borrows` | Wypożyczenie książki |
| `PATCH` | `/api/borrows/:id` | Przedłużenie terminu wypożyczenia |
| `PATCH` | `/api/borrows/:id/return` | Zwrot książki |

#### **Ulubione:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/favorites` | Lista ulubionych książek |
| `GET` | `/api/favorites/:bookId` | Sprawdzenie statusu ulubionej |
| `POST` | `/api/favorites` | Dodanie do ulubionych |
| `DELETE` | `/api/favorites/:bookId` | Usunięcie z ulubionych |

#### **Recenzje:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/reviews/:bookId` | Dodanie recenzji |
| `DELETE` | `/api/reviews/:id` | Usunięcie własnej recenzji |

### **👑 Administratorskie (wymagają JWT + uprawnienia admina):**

#### **Zarządzanie użytkownikami:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/user` | Lista wszystkich użytkowników |
| `DELETE` | `/api/user/:id` | Usunięcie użytkownika przez ID |

#### **Zarządzanie książkami:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `POST` | `/api/books` | Dodanie nowej książki |
| `PUT` | `/api/books/:ISBN_13` | Edycja książki |
| `DELETE` | `/api/books/:ISBN_13` | Usunięcie książki |

#### **Zarządzanie egzemplarzami:**
| Metoda | Endpoint | Opis |
|--------|----------|------|
| `GET` | `/api/books/:ISBN_13/copies/:id` | Szczegóły konkretnego egzemplarza |
| `POST` | `/api/books/:ISBN_13/copies` | Dodanie egzemplarza |
| `PUT` | `/api/books/:ISBN_13/copies/:id` | Edycja egzemplarza |
| `DELETE` | `/api/books/:ISBN_13/copies/:id` | Usunięcie egzemplarza |

## 📊 Schema bazy danych

### **Tabela: users**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `id` | INTEGER | Klucz główny | PRIMARY KEY, AUTO_INCREMENT |
| `name` | VARCHAR | Imię i nazwisko | NOT NULL |
| `email` | VARCHAR | Adres e-mail | NOT NULL, UNIQUE |
| `password` | VARCHAR | Zahashowane hasło | NOT NULL |
| `createdAt` | DATETIME | Data utworzenia | NOT NULL |
| `updatedAt` | DATETIME | Data ostatniej modyfikacji | NOT NULL |

### **Tabela: books**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `ISBN_13` | VARCHAR(13) | Numer ISBN-13 | PRIMARY KEY |
| `title` | VARCHAR | Tytuł książki | NOT NULL |
| `author` | VARCHAR | Autor | NOT NULL |
| `publisher` | VARCHAR | Wydawnictwo | |
| `year` | INTEGER | Rok wydania | |
| `description` | TEXT | Opis książki | |

### **Tabela: copies**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `id` | INTEGER | Klucz główny | PRIMARY KEY, AUTO_INCREMENT |
| `ISBN_13` | VARCHAR(13) | Odniesienie do książki | FOREIGN KEY → books.ISBN_13 |
| `status` | VARCHAR | Status ('available', 'borrowed') | NOT NULL |
| `borrowedBy` | INTEGER | ID wypożyczającego | FOREIGN KEY → users.id |

### **Tabela: borrows**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `id` | INTEGER | Klucz główny | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INTEGER | ID użytkownika | FOREIGN KEY → users.id, NOT NULL |
| `copyId` | INTEGER | ID egzemplarza | FOREIGN KEY → copies.id, NOT NULL |
| `borrowedAt` | DATETIME | Data wypożyczenia | NOT NULL |
| `dueDate` | DATETIME | Termin zwrotu | NOT NULL |
| `returnedAt` | DATETIME | Data zwrotu | |

### **Tabela: reviews**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `id` | INTEGER | Klucz główny | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INTEGER | ID użytkownika | FOREIGN KEY → users.id, NOT NULL |
| `bookId` | VARCHAR(13) | ISBN książki | FOREIGN KEY → books.ISBN_13, NOT NULL |
| `rating` | INTEGER | Ocena (1-5) | NOT NULL |
| `comment` | TEXT | Komentarz | |
| `createdAt` | DATETIME | Data utworzenia | NOT NULL |

### **Tabela: favorites**
| Kolumna | Typ | Opis | Ograniczenia |
|---------|-----|------|--------------|
| `id` | INTEGER | Klucz główny | PRIMARY KEY, AUTO_INCREMENT |
| `userId` | INTEGER | ID użytkownika | FOREIGN KEY → users.id, NOT NULL |
| `bookId` | VARCHAR(13) | ISBN książki | FOREIGN KEY → books.ISBN_13, NOT NULL |
| | | | UNIQUE(userId, bookId) |

## 🔗 Relacje w bazie danych

- **User → Borrows** (1:N) - Użytkownik może mieć wiele wypożyczeń
- **User → Reviews** (1:N) - Użytkownik może napisać wiele recenzji
- **User → Favorites** (1:N) - Użytkownik może mieć wiele ulubionych
- **Book → Copies** (1:N) - Książka może mieć wiele egzemplarzy
- **Book → Reviews** (1:N) - Książka może mieć wiele recenzji
- **Book → Favorites** (1:N) - Książka może być ulubiona przez wielu
- **Copy → Borrows** (1:N) - Egzemplarz może mieć historię wypożyczeń
- **User ← Copy** (N:1) - Egzemplarz może być wypożyczony przez użytkownika



