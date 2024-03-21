# Außerhalb des Login-Bereich:

## Überblick-Seite:

- [ ] Rezepte werden nach "Neueste zuerst" geordnet auf der Entdecken Seite korrekt mit Bild angezeigt
- [ ] Bei Klick auf den Favorites-Buitton erscheint eine Toast-Meldung, die auf den Login verweist
- [ ] Der Add-Recipe-Button (mit dem Plus) ist ausgeblendet
- [ ] Die Filter-Funktion funktioniert
- [ ] Der Scroll-to-Top Button erscheint nach kurzem down-scrollen und funktioniert
- [ ] Wird auf ein Rezept geklickt, wird der User auf die DetailPage weitergeleitet
      Andere Seiten:
- [ ] Die Plan-, Favoriten- und Einkaufseite sind für den User gesperrt und weisen mit Verlinkung auf die Login-Seite, den User an, sich für die volle Funktionalität anzumelden
- [ ] auf der Login-Seite wird Google als bisher einzige Login-Möglichkeit angezeigt
      Header&Überschriften sowie Design sind überall konsistent

## Detail-Page:

- [ ] Mit dem Zurück-Button kann wieder auf die Overview-Seite navigiert werden
- [ ] Das Bild wird korrekt angezeigt
- [ ] Alle Buttons sind gesperrt und lösen einen Toast aus
- [ ] Das Rezept wird korrekt dargestellt (Zutaten, ein Ernährungstag && Zubereitung/Notizen/Videos sind voneinander getrennt anzuklicken und sichtbar)
- [ ] Das Erstellen von Notizen ist gesperrt und löst einen Toast aus

# Innerhalb des Login-Bereich:

## Auf der Profil-Seite:

- [ ] Der Logout-Button ist vorhanden und lässt den User per Click ausloggen
- [ ] Das Bild (falls vorhanden) wird korrekt angezeigt
- [ ] Der Settings-Button ist in der linken oberen Seite vorhanden
- [ ] durch das Klicken auf das Bearbeiten-Icon kann das Profilbild und der Name bearbeitet werden
- [ ] die Änderungen können dann gespeichert werden oder durch ein Klick auf das X-Icon abgebrochen werden

## Auf der Settings-Seite:

- [ ] Der User kann dort die im Plan anzuzeigenden Tage aktivieren bzw. deaktivieren (togglen)
- [ ] Der User kann den Default der im Plan vermerkten Anzahl der Portionen durch das Klicken auf ein Minus oder Plus regulieren
- [ ] Im Plan werden diese Einstellungen korrekt übernommen (die Anzahl der Portionen nach neuem Generieren der Gerichte)
- [ ] Der User kommt auf durch die Icons Favoriten, gekocht und Rezepte auf die jeweiligen Seiten
- [ ] auf der "gekocht" Seite gibt es einen back button, der wieder zur Profil Seite führt
- [ ] auf der gekocht Seite werden alle vom User als gekocht markierten Rezepte angezeigt
- [ ] von der Settings-Seite aus kann der User auf die eigenen Rezepte Seite navigieren
- [ ] Beim Klick auf das "Gib uns Feedback"-Feld öffnet sich das Feedback-Formular
- [ ] Nach dem Befüllen kann der Kunde das Feedback absenden

## Auf der Rezepte-Seite:

- [ ] Der User kann sich dort Kochbücher anlegen und anzeigen lassen
- [ ] Der User sieht in den Kochbüchern die Rezepte, die er dem jeweiligen Kochbuch zugeordnet hat
- [ ] Mit Klick auf den Back-Button kommt der User wieder auf die Profilseite

## Auf der Favoriten-Seite:

- [ ] Der User sieht seine als Favoriten markierten Rezepte
- [ ] der User kann die Rezepte entfavorisieren, dann verschwinden die Rezepte aus der Favoritenansicht
- [ ] Mit Klick auf das Rezept kommt der User auf die Detailansicht der Rezepte

# Weitere Funktionen

## Filter-Funktion:

- [ ] Bei Klick auf den Filter-Button im Header öffnet sich das Filter-Menü
- [ ] Das Suchfeld funktioniert (wenn nach Eingabe der Lupen-Button gedrückt wird, erscheinen die passenden Gerichte)
- [ ] Die Einzelnen Filter lassen sich toggeln und funktionieren wie vorgesehen
- [ ] Wird auf "alles zurücksetzen" geklickt werden die einzelnen Filter deaktiviert und die Rezepte erscheinen in der default Reihenfolge

## Navbar:

- [ ] Alle Seiten können durch die Navigation über das entsprechende Icon erreicht werden
- [ ] Die Navbar zeigt durch Farbänderung des entsprechenden Icon an, auf welcher Seite sich der User im Moment befindet
- [ ] Die Profilseite wird erst bei Login als "Profil" in der Navbar angezeigt, davor ist sie als "Login" gekennzeichnet

## Loading:

- [ ] Skeleton-Loader und "Laderad" tauchen beim Ladevorgang auf
