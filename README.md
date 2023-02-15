# AutocompleteJS

## Descrizione: 

Il progetto AutocompleteJS è una pagina web con al suo interno un tag `<input>` in cui e possibile cercare 
un nome di una squadra di calcio italiana facilitando la ricerca con un autocomplete.

L'auto-completamento dei nomi delle squadre di calcio viene ottenuto grazie a una richiesta `XMLHttpRequest` statica al file json `autocomplete.json`, 
che a sua volta effettua una nuova chiamata  `XMLHttpRequest` per ottenere tutte le informazioni della squadra selezionata.


## Tecnologie utilizzate: 

Codice javascript è `vanillaJS` friendly, non sono state utilizzate altre librerie esterne.

Lo styling della pagina `index.html` viene utilizzato `scss` (preprocessore css). La cartella `style` contiene due sotto cartelle `source` e `build`.
La cartella `source` contiene il sorgente dei file di style, invece la cartella `build` contiene lo style dopo la compilazione. 

Per compilare un file di stile rimando alla pagina d'installazione e compilazione di [Sass](https://sass-lang.com/install) 



## Esecuzione: 

Lanciare in un browser compatibile il file `index.html`


## Fonte dati:

- ChatGPT
