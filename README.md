# 🍽️ TAB – System Zarządzania Zamówieniami w Restauracji  

Projekt zespołowy zrealizowany w ramach zajęć dotyczących aplikacji bazodanowych.  
Aplikacja została stworzona w architekturze **dwuwarstwowej (Client–Server)**, łącząc frontend w Next.js z backendem w Django Ninja.  
System wspiera zarządzanie menu, składanie zamówień i generowanie raportów sprzedaży.  

---

## 🚀 Funkcjonalności

- **Zarządzanie menu**  
  Dodawanie i usuwanie dań wraz z nazwą, opisem, ceną, składnikami i alergenami.  
- **Obsługa zamówień**  
  Tworzenie nowych zamówień z unikalnym numerem, czasem realizacji i dodatkowymi uwagami klienta.  
- **Raportowanie**  
  - przychody dzienne i miesięczne,  
  - ranking popularności dań,  
  - raporty PDF z tabelami i wykresami.  
- **Panel administratora i pracownika**  
  Oddzielone uprawnienia użytkowników.  
- **Bezpieczeństwo**  
  Logowanie i autoryzacja z wykorzystaniem JWT.  

---

## 🛠️ Technologie

### Frontend
- [Next.js (App Router)](https://nextjs.org/) + React  
- TypeScript  
- Tailwind CSS  
- JWT auth + middleware  

### Backend
- [Django 5.1](https://www.djangoproject.com/) + [Django Ninja](https://django-ninja.dev/)  
- PostgreSQL  
- Pydantic + Ninja Extra  
- ReportLab & Matplotlib (raporty PDF, wykresy)  
- unittest – testy jednostkowe  

---

## 📂 Struktura projektu

### Frontend (Next.js)
```
app/
 ├─ api/              ← backend API
 ├─ login/, register/ ← strony logowania/rejestracji
 ├─ dashboard/, menu/ ← panel użytkownika
 └─ layout.tsx        ← globalny layout
components/           ← komponenty wielokrotnego użytku
context/              ← globalny stan aplikacji
lib/                  ← logika pomocnicza
types/                ← definicje typów
```

### Backend (Django Ninja)
```
project/
 ├─ core/      ← konfiguracja projektu
 ├─ users/     ← zarządzanie użytkownikami (modele, API, schematy)
 ├─ reports/   ← generowanie raportów i PDF
 └─ dania/     ← moduł zarządzania menu
```

---

## 📊 Demo & Raporty

- **Frontend (demo)**: [tab-frontend (Netlify)](https://tab-frontentd.netlify.app/)  
- **Logowanie**: konto administratora umożliwia dodawanie dań i generowanie raportów  
- **Raporty**: automatycznie generowane pliki PDF zawierające podsumowania oraz wykresy  

---

## 📸 Zrzuty ekranu

*(Wstaw screeny z aplikacji – panel menu, lista zamówień, raport PDF)*  

---

## 👥 Zespół

- Maja Witosz  
- Szymon Łakomy 
- Piotr Renard  
- Piotr Sosgórnik  
- Wiktoria Skorupa  

---

## 🔗 Repozytoria

- [Frontend – GitHub](https://github.com/majawitosz/tab-frontend)  
- Backend – repozytorium prywatne (Django Ninja + PostgreSQL)  

---

## ✅ Podsumowanie

Projekt pokazuje praktyczne połączenie **Next.js + Django Ninja + PostgreSQL**.  
Zrealizowane zostały kluczowe funkcje biznesowe: zarządzanie menu, obsługa zamówień i raportowanie.  
Aplikacja demonstruje wykorzystanie REST API, JWT, raportów PDF oraz metodyki **MoSCoW** do ustalania priorytetów.  

💡 To świetny projekt do CV – łączy frontend, backend, bazę danych i raportowanie w spójną aplikację.  
