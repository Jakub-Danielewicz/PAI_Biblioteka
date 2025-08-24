# Dokumentacja API Backend

## Książki

### GET /books
Zwraca listę książek. Obsługuje paginację i filtrowanie po polach książki (np. `author`, `title`).
**Query params:**
- `page` (domyślnie 1)
- `limit` (domyślnie 10)
- dowolne pole z modelu Book

### GET /books/:ISBN_13
Zwraca szczegóły książki o podanym ISBN_13 wraz z egzemplarzami.

### POST /books
Tworzy nową książkę.
**Body:**
```
{
  "ISBN_13": "9781234567890",
  "title": "Przykładowa książka",
  "author": "Adam Nowak",
  "publisher": "Wydawnictwo X",
  "year": 2020
}
```

### PUT /books/:ISBN_13
Aktualizuje dane książki.
**Body:**
```
{
  "title": "Nowy tytuł",
  "author": "Jan Kowalski"
}
```

### DELETE /books/:ISBN_13
Usuwa książkę.

---

## Egzemplarze książek

### GET /books/:ISBN_13/copies
Zwraca egzemplarze danej książki.

### POST /books/:ISBN_13/copies
Tworzy egzemplarz książki.
**Body:**
```
{
  "status": "available"
}
```

### PUT /books/:ISBN_13/copies/:id
Aktualizuje egzemplarz.
**Body:**
```
{
  "status": "borrowed"
}
```

### DELETE /books/:ISBN_13/copies/:id
Usuwa egzemplarz.

---

## Użytkownicy

### POST /users
Tworzy użytkownika.
**Body:**
```
{
  "name": "Jan Kowalski",
  "email": "jan.kowalski@example.com"
}
```

---

## Wypożyczenia

### POST /borrow
Wypożycza egzemplarz książki użytkownikowi.
**Body:**
```
{
  "userId": 1,
  "copyId": 5
}
```

### POST /return
Zwraca egzemplarz książki.
**Body:**
```
{
  "userId": 1,
  "copyId": 5
}
```

### GET /borrows?userId=...&bookId=...
Zwraca listę wypożyczeń. Można filtrować po użytkowniku (`userId`) i książce (`bookId` = ISBN_13).

---

## Odpowiedzi błędów
W przypadku błędów API zwraca:
```
{
  "error": "Opis błędu"
}
```

---

## Uwagi
- Wszystkie żądania wymagają nagłówka `Content-Type: application/json`.
- Wartości identyfikatorów (`userId`, `copyId`, `ISBN_13`) muszą istnieć w bazie.
