window.onload = function () {

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions-container');


    // Aggiungo un listener per l'input dell'utente
    searchInput.addEventListener('keyup', handleInput);
    searchButton.addEventListener("click", handleButtonSearch);

    // setto il valore di default
    getInfoTeam(searchInput.defaultValue, populateInfoTeam)


    /**
     * @function getInfoTeam
     * @description Questa funzione ottiene le informazioni su una squadra di calcio dal file data.json.
     * @param {string} name - Il nome della squadra di calcio.
     * @param {function} callback - Una funzione di callback che verrà eseguita se la richiesta viene eseguita con successo.
     * @returns {void}
     */
    function getInfoTeam(name, callback) {

        if (name !== "") {

            let xhr = new XMLHttpRequest();
            xhr.open('GET', '../storage/data.json', true);
            let res = null;

            xhr.onload = function () {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    console.log(data.squadre);
                    res = data.squadre.find(team => team.nome.toUpperCase() === name.toUpperCase());

                    console.log("Response: " + res);

                    if (res !== undefined) {
                        let msgParam = "Squadra non trovata";
                        callback(res, msgParam);
                    } else {
                        console.warn("squadra non trovata")
                        let msg = "Squadra non trovata";
                        errorInfoTeam(msg);
                    }

                } else {
                    //eccezione
                    console.error('La richiesta non è riuscita');
                    let msg = "errroe imprevisto";
                    errorInfoTeam(msg)
                }
            };
            xhr.send();
        } else {
            console.log("No value");
            let msg = "Inserisci una squadra valida"
            errorInfoTeam(msg);
        }

    }

    /**
     * @function searchAutocomplete
     * @description Questa funzione gestisce i risultati dell'autocompletamento e popola il contenitore dei suggerimenti.
     * @param {array} results - Un array di oggetti contenenti i risultati dell'autocompletamento.
     * @returns {void}
     */
    function searchAutocomplete(results) {

        suggestionsContainer.innerHTML = '';

        // Svuota il contenitore dei suggerimenti
        suggestionsContainer.innerHTML = '<ul></ul>';

        results.forEach((value) => {
            const li = document.createElement('li');
            li.style.cursor = "pointer";
            li.style.backgroundColor = "white";
            li.textContent = value.nome;

            li.addEventListener("mouseenter", function () {
                li.style.backgroundColor = "lightgray";
            });

            li.addEventListener("mouseleave", function () {
                li.style.backgroundColor = "white";
            });

            li.addEventListener('click', () => {
                // gestisco l'evento di click qui
                console.log('Value' + li.innerText);
                searchInput.value = li.textContent;
                suggestionsContainer.style.display = "none";
                getInfoTeam(searchInput.value, populateInfoTeam);

            });

            suggestionsContainer.querySelector('ul').appendChild(li);
        });
    }

    /**
     * @function getNameTeamAutocomplete
     * @description Questa funzione esegue una richiesta HTTP per recuperare un elenco di squadre in formato JSON
     * e restituisce una promessa che rappresenta i risultati filtrati per nome.
     * @param {string} name - La stringa da utilizzare per filtrare i risultati.
     * @returns {Promise} Una promessa che restituisce un array di oggetti contenenti i risultati filtrati per nome.
     */
    function getNameTeamAutocomplete(name) {

        return new Promise(function (resolve, reject) {


            let xhr = new XMLHttpRequest();
            xhr.open('GET', '../storage/autocomplete.json', true);

            xhr.onload = function () {
                if (xhr.status === 200) {
                    let data = JSON.parse(xhr.responseText);
                    let res = data.squadre.filter(team => team.nome.toLowerCase().includes(name));

                    console.log("Response: " + res);

                    if (res !== undefined) {
                        resolve(res)
                    } else {
                        console.warn("squadra non trovata")
                        let msg = "Squadra non trovata";
                        reject(msg)
                    }

                } else {
                    //eccezione
                    console.error('La richiesta non è riuscita');
                    let msg = "errroe imprevisto";
                    reject(msg);
                }
            };
            xhr.send();

        })
    }

    /**
     * @function handleInput
     * @description Questa funzione gestisce l'input dell'utente, eseguendo una ricerca automatica per suggerimenti di squadre in base al valore inserito nella casella di ricerca.
     * @returns {void}
     */
    function handleInput() {

        const inputValue = searchInput.value.toLowerCase();

        if (inputValue !== "") {

            suggestionsContainer.style.display = "block";

            getNameTeamAutocomplete(inputValue)
                .then((res) => searchAutocomplete(res))
                .catch((msg) => errorInfoTeam(msg))

        } else {
            suggestionsContainer.style.display = "none";
        }
    }

    /**
     * @function handleButtonSearch
     * @description Questa funzione gestisce l'evento di click sul pulsante di ricerca, eseguendo una richiesta per
     * ottenere informazioni sulla squadra cercata e visualizzando i risultati.
     * @returns {void}
     */
    function handleButtonSearch() {
        // ripulisco container suggerimenti
        suggestionsContainer.innerHTML = "";
        getInfoTeam(searchInput.value, populateInfoTeam)

    }

    /**
     * @function populateInfoTeam
     * @description Questa funzione popola le informazioni di una squadra nel div container
     * @param teamData oggetto squadra contenente tutte le informazioni
     * @returns {void}
     * */
    function populateInfoTeam(teamData) {

        const divInfo = document.getElementById('info-team');
        divInfo.innerHTML = "";
        let myUl = document.createElement('ul');

        for (let key in teamData) {
            let li = document.createElement('li');
            li.innerHTML = `<b>${key.toUpperCase()} : </b>`;

            if (key !== "logo") {

                if (teamData[key] instanceof Object) {

                    let titoli = teamData[key];
                    let ulTitoli = document.createElement('ul');

                    for (let keyTitolo in titoli) {

                        let liTitoli = document.createElement('li');
                        liTitoli.innerHTML = `<b>${keyTitolo.toUpperCase()} : </b>${titoli[keyTitolo]}`;
                        ulTitoli.appendChild(liTitoli);
                    }
                    li.appendChild(ulTitoli);

                } else {
                    li.innerHTML = `<b>${key.toUpperCase()} : </b>${teamData[key]}`;
                }
                myUl.appendChild(li);
            } else {
                const divLogo = document.getElementById('team-logo');
                divLogo.src = teamData[key]
            }
        }
        divInfo.appendChild(myUl);
    }

    /**
     * @function errorInfoTeam
     * @description Questa funzione popola il div contain in caso di errore
     * @param errorMsg stringa contenente il messaggio di errore*/
    function errorInfoTeam(errorMsg) {

        const divErrorImg = document.getElementById('team-logo');
        const divErrorInfo = document.getElementById('info-team');

        divErrorInfo.innerHTML = "";
        divErrorImg.innerHTML = "";

        const para = document.createElement("p");
        const node = document.createTextNode(errorMsg);


        let textError = document.createElement("h1");
        textError.appendChild(node);
        para.appendChild(textError);


        console.log("dentro errore");
        divErrorImg.src = 'src/image/error/error.png';

        divErrorInfo.appendChild(para);
    }
}