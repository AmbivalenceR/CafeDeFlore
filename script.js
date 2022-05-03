/* DECLARATION DES SELECTEURS (QUERY SELECTORS) */
// RECUPERATION DES ELEMENTS INPUTS
let formulaire = document.querySelector("#formulaire");
let InputNomBoisson = document.querySelector(".InputNomBoisson");
let inputtQuantite = document.querySelector(".inputQuantite");
let inputPrixAchatHt = document.querySelector(".inputPrixAchatHt");
let inputPrixVenteHt = document.querySelector(".inputPrixVenteHt");
let inputMarge = document.querySelector(".inputMarge");
let inputTypeBoisson = document.querySelector(".inputTypeBoisson");
let inputDegre = document.querySelector(".inputDegre");
let inputFormulaireSubmit = document.querySelector(".inputFormulaireSubmit");

/* CREATION DE L'EMPLACEMENT DES DONNEES DU TABLEAU STOCK*/
let contentStockTable = document.querySelector(".contentStockTable");

/* RECUPERATION DU LOCAL STORAGE*/
// DECLARATION DU TABLEAU DE STOCK
let arrayStock = [];
// Remise au format objet Javascript de mon local Storage
let lsParsed = JSON.parse(localStorage.getItem("@stocks"));
// let localStorageparsed = JSON.parsed(localStorage.getItem("stock"))
if (!lsParsed) {
  arrayStock = [];
} else {
  arrayStock = lsParsed;
  // Lance la fonction affichage du stock
  // showStock();
}

/* DECLENCHEMENT DE L'EVENT CHANGE SUR TYPE DE BOISSON */
inputTypeBoisson.addEventListener("change", function () {
  if (inputTypeBoisson.value == "Boisson alcoolisée") {
    inputDegre.style.display = "";
  } else {
    inputDegre.style.display = "none";
  }
});

/* DECLENCHEMENT DE L'EVENT CALCUL MARGE HT */
let inputValeurPrixAchatHt = Number(
  document.querySelector(".inputPrixAchatHt").value
);
let inputValeurPrixVenteHt = Number(
  document.querySelector(".inputPrixVenteHt").value
);

function calculMarge() {
  if (inputValeurPrixAchatHt != "" && inputValeurPrixVenteHt != "") {
    inputMarge = Number(inputValeurPrixVenteHt - inputValeurPrixAchatHt);
    document.getElementById("marge").value = inputMarge;
  }
}

/* DECLENCHEMENT DU CALCUL PRIX DE VENTE TTC SELON LE TYPE DE BOISSON CHOISI */

/* DECLENCHEMENT DE L'EVENT AU SUBMIT */
formulaire.addEventListener("submit", function (e) {
  // annulation du rechargement de la page
  e.preventDefault();
  console.log(contentStockTable);
  // récupération des données du formulaire
  let formData = new FormData(formulaire);
  let nomBoissonGet = formData.get("nomBoisson");
  let quantiteGet = formData.get("quantite");
  let prixAchatHtGet = formData.get("prixAchatHt");
  let prixVenteHtGet = formData.get("prixVenteHt");
  let margeGet = formData.get("marge");
  let prixVenteTtcGet = formData.get("prixVenteTtc");
  let typeBoissonGet = formData.get("typeBoisson");
  let degreAlcoolGet = formData.get("degreAlcool");

  //CREATION DE L'OBJET BOISSON
  let boisson;
  if (typeBoissonGet == "BoissonSansAlcool") {
    contact = new BoissonSansAlcool(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      margeGet,
      prixVenteTtcGet,
      typeBoissonGet
    );
  } else {
    boisson = new BoissonAlcoolisée(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      margeGet,
      prixVenteTtcGet,
      typeBoissonGet,
      degreAlcoolGet
    );
  }

  //ENVOI DE L'OBJET CONTACT DANS LE TABLEAU AVEC LA METHODE PUSH
  arrayStock.push(boisson);
  //TRANSFORMATION DE MON TABLEAU EN CHAINE DE CARACTERE */
  let jsonArrayStock = JSON.stringify(arrayStock);
  localStorage.setItem("@stocks", jsonArrayStock);
  formulaire.reset();
  // APPEL DE LA FONCTION showBoisson
  showStock(formData);
});

function showStock(formData) {
  //Création de la fonction showStock avec la méthode forEach()
  //Création de la variable content
  arrayStock.forEach(function (element) {
    //CREATION DE MES ELEMENTS DU CONTAINER STOCK
    let tr = document.createElement("tr");
    let tdNom = document.createElement("td");
    let tdQuantite = document.createElement("td");
    let tdPrixAchatHt = document.createElement("td");
    let tdPrixVenteHt = document.createElement("td");
    let tdMarge = document.createElement("td");
    let tdprixVenteTtc = document.createElement("td");
    let tdType = document.createElement("td");
    let tdDegreAlcool = document.createElement("td");

    tdNom.innerHTML = element.nom;
    tdQuantite.innerHTML = element.quantite;
    tdPrixAchatHt.innerHTML = element.prixAchatHt;
    tdPrixVenteHt.innerHTML = element.prixVenteHt;
    tdMarge.innerHTML = element.prixVenteTtc;
    tdprixVenteTtc.innerHTML = element.marge;
    tdType.innerHTML = element.typeBoisson;
    tdDegreAlcool.innerHTML = element.degreAlcool;

    tr.appendChild(tdNom);
    tr.appendChild(tdQuantite);
    tr.appendChild(tdPrixAchatHt);
    tr.appendChild(tdPrixVenteHt);
    tr.appendChild(tdMarge);
    tr.appendChild(tdprixVenteTtc);
    tr.appendChild(tdType);
    tr.appendChild(tdDegreAlcool);

    contentStockTable.appendChild(tr);

    let tdButtonSupprimer = document.createElement("button");
    tdButtonSupprimer.innerText = "Supprimer";
    tr.appendChild(tdButtonSupprimer);
    tdButtonSupprimer.className = "tdButton";
  });
}

/* CLASSE BOISSON PROTOTYPE */
class Boisson {
  constructor(
    nom,
    quantite,
    prixAchatHt,
    prixVenteHt,
    prixVenteTtc,
    marge,
    typeBoisson
  ) {
    this.nom = nom;
    this.quantite = quantite;
    this.prixAchatHt = prixAchatHt;
    this.prixVenteHt = prixVenteHt;
    this.prixVenteTtc = prixVenteTtc;
    this.marge = marge;
    this.typeBoisson = typeBoisson;
  }
}

// FONCTION CLASSE BOISSON SANS ALCOOL//
class BoissonSansAlcool extends Boisson {
  constructor(
    nom,
    quantite,
    prixAchatHt,
    prixVenteHt,
    prixVenteTtc,
    marge,
    typeBoissonGet
  ) {
    super(
      nom,
      quantite,
      prixAchatHt,
      prixVenteHt,
      prixVenteTtc,
      marge,
      typeBoissonGet
    );
    this.type = typeBoissonGet;
  }
}

// FONCTION CLASSE BOISSON ALCOOLISEE//
class BoissonAlcoolisée extends Boisson {
  constructor(
    nom,
    quantite,
    prixAchatHt,
    prixVenteHt,
    prixVenteTtc,
    marge,
    typeBoissonGet,
    degreAlcool
  ) {
    super(
      nom,
      quantite,
      prixAchatHt,
      prixVenteHt,
      prixVenteTtc,
      marge,
      typeBoissonGet,
      degreAlcool
    );
    this.type = typeBoissonGet;
    this.degre = degreAlcool;
  }
}

//GESTION DU BOUTON TYPE DE BOISSON. FAIRE APPARAITRE L'INPUT DEGRE D'ALCOOL SI INPUT ALCOOL CHOISI
