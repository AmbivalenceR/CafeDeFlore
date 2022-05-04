/* DECLARATION DES SELECTEURS (QUERY SELECTORS) */
// RECUPERATION DES ELEMENTS INPUTS
let formulaire = document.querySelector("#formulaire");
let InputNomBoisson = document.querySelector(".inputNomBoisson");
let inputtQuantite = document.querySelector(".inputQuantite");
let inputPrixAchatHt = document.querySelector(".inputPrixAchatHt");
let inputPrixVenteHt = document.querySelector(".inputPrixVenteHt");
let inputMarge = document.querySelector(".inputMarge");
let inputPrixVenteTtc = document.querySelector(".inputPrixVenteTtc");
let inputTypeBoisson = document.querySelector(".inputTypeBoisson");
let inputDegre = document.querySelector(".inputDegre");
let inputFormulaireSubmit = document.querySelector(".inputFormulaireSubmit");

/* CREATION DE L'EMPLACEMENT DES DONNEES DU TABLEAU STOCK*/
let divTableauStock = document.querySelector(".divTableauStock");

// DECLARATION DU TABLEAU DE STOCK
let arrayStock;

/* RECUPERATION DU LOCAL STORAGE*/
if (!localStorage.getItem("@stocks")) {
  arrayStock = [];
} else {
  // Remise au format objet Javascript de mon local Storage
  let lsParsed = JSON.parse(localStorage.getItem("@stocks"));
  arrayStock = lsParsed;
  showStock();
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
  // récupération des données du formulaire
  let formData = new FormData(formulaire);
  let nomBoissonGet = formData.get("nomBoisson");
  let quantiteGet = formData.get("quantite");
  let prixAchatHtGet = formData.get("prixAchatHt");
  let prixVenteHtGet = formData.get("prixVenteHt");
  let margeGet = formData.get("marge");
  let prixVenteTtcGet = formData.get("prixVenteTtc");
  let typeBoissonGet = formData.get("typeBoisson");
  let degreeAlcoolGet = formData.get("degreAlcool");

  //CREATION DE L'OBJET BOISSON
  let boisson;
  if (typeBoissonGet == "BoissonSansAlcool") {
    contact = new BoissonSansAlcool(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      margeGet,
      prixVenteTtcGet
      // typeBoissonGet
    );
  } else {
    boisson = new BoissonAlcoolisée(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      margeGet,
      prixVenteTtcGet,
      degreeAlcoolGet
    );
  }

  //ENVOI DE L'OBJET CONTACT DANS LE TABLEAU AVEC LA METHODE PUSH
  arrayStock.push(boisson);
  //TRANSFORMATION DE MON TABLEAU EN CHAINE DE CARACTERE */
  // let jsonArrayStock = JSON.stringify(arrayStock);
  localStorage.setItem("@stocks", JSON.stringify(arrayStock));
  formulaire.reset();
  // APPEL DE LA FONCTION showBoisson
  showStock(formData);
});

// arrayStock[index].nomDeLaValeur = NewValeurInput
// recreer un nouveau local storage

function showStock(formData) {
  //Création de la fonction showStock avec la méthode forEach()
  //Création de la variable content
  let contentStock = "";
  arrayStock.forEach(function (element) {
    divTableauStock.innerHTML = contentStock;
    //Ajout à la variable content de mon élément
    // enteteTableau
    // contentStock.appendChild(enteteTableau);
    contentStock += `
    <tr>
    <td colspan="1"><input class="modifNom inputStock" type="text" value="${element.nom}"/></td>
    <td colspan="1"><input class="modifType inputStock" type="text" value="${element.type}"/></td>
    <td colspan="1"><input class="modifDegre inputStock" type="text" value="${element.degreAlcool}"/></td>
    <td colspan="1"><input class="modifQuantite inputStock" type="number" value="${element.quantite}"/></td>
    <td colspan="1"><input class="modifPrixAchatHT inputStock" type="text" value="${element.prixAchatHt}"/></td>
    <td colspan="1"><input class="modifPrixVenteHT inputStock" type="text" value="${element.prixVenteHt}"/></td>
    <td colspan="1"><input class="modifMarge inputStock" type="text" value="${element.marge}"/></td>
    <td colspan="1"><input class="modifPrixVenteTTC inputStock" type="text" value="${element.prixVenteTtc}"/></td>
    <td colspan="1"><button class="deleteButton">Supprimer</button></td>
    <td colspan="1"><button class="modifButton">QR Code</button></td>
    </tr>`;
  });
  divTableauStock.innerHTML = contentStock;
  // let deleteButtonTableauStock = document.querySelector(".deleteButton");

  let deleteBtn = document.querySelectorAll(".deleteButton");
  deleteBtn.forEach(function (element, index) {
    element.addEventListener("click", function () {
      arrayStock.splice(index, 1);
      localStorage.setItem("@stocks", JSON.stringify(arrayStock));
      showStock();
    });
  });

  let modifNom = document.querySelectorAll(".modifNom");
  console.log(modifNom);
  modifNom.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].nom = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifQuantite = document.querySelectorAll(".modifQuantite");
  console.log(modifQuantite);
  modifQuantite.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].quantite = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifPrixAchatHT = document.querySelectorAll(".modifPrixAchatHT");
  console.log(modifPrixAchatHT);
  modifPrixAchatHT.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].prixAchatHt = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifPrixVenteHT = document.querySelectorAll(".modifPrixVenteHT");
  console.log(modifPrixVenteHT);
  modifPrixVenteHT.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].prixVenteHt = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifPrixVenteTTC = document.querySelectorAll(".modifPrixVenteTTC");
  console.log(modifPrixVenteTTC);
  modifPrixVenteTTC.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].prixVenteTtc = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifType = document.querySelectorAll(".modifType");
  console.log(modifType);
  modifType.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].type = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });

  let modifDegre = document.querySelectorAll(".modifDegre");
  console.log(modifDegre);
  modifDegre.forEach(function (element, index) {
    element.addEventListener("keydown", function (e) {
      if (e.key == "Enter") {
        console.log(element.value);
        arrayStock[index].degre = element.value;
        let indexE = arrayStock[index.element];
        console.log(indexE + " element modifié du tableau");
        console.log(arrayStock);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      } else {
        false;
      }
    });
  });
}

/* CLASSE BOISSON PROTOTYPE */
class Boisson {
  constructor(nom, quantite, prixAchatHt, prixVenteHt, prixVenteTtc, marge) {
    this.nom = nom;
    this.quantite = quantite;
    this.prixAchatHt = prixAchatHt;
    this.prixVenteHt = prixVenteHt;
    this.prixVenteTtc = prixVenteTtc;
    this.marge = marge;
  }
}
// console.log("Boisson type");

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
    super(nom, quantite, prixAchatHt, prixVenteHt, prixVenteTtc, marge);
    this.type = typeBoissonGet;
  }
}
// console.log("Boisson sans alcool");

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
    super(nom, quantite, prixAchatHt, prixVenteHt, prixVenteTtc, marge);
    this.type = typeBoissonGet;
    this.degre = degreAlcool;
  }
}
// console.log("Boisson alcoolisée");

//GESTION DU BOUTON TYPE DE BOISSON. FAIRE APPARAITRE L'INPUT DEGRE D'ALCOOL SI INPUT ALCOOL CHOISI
