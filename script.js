/* DECLARATION DES SELECTEURS (QUERY SELECTORS) */
// RECUPERATION DES ELEMENTS INPUTS
let formulaire = document.querySelector("#formulaire");
let InputNomBoisson = document.querySelector(".inputNomBoisson");
let inputTypeBoisson = document.querySelector(".inputTypeBoisson");
let inputDegre = document.querySelector(".inputDegre");
let inputtQuantite = document.querySelector(".inputQuantite");
let inputPrixAchatHt = document.querySelector(".inputPrixAchatHt");
let inputPrixVenteHt = document.querySelector(".inputPrixVenteHt");
let inputMarge = document.querySelector(".inputMarge");
let inputPrixVenteTtc = document.querySelector(".inputPrixVenteTtc");

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
  if (inputTypeBoisson.value == "BoissonAlcoolisée") {
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
  let typeBoissonGet = formData.get("typeBoisson");
  let degreeAlcoolGet = formData.get("degreAlcool");

  // Calcul Marge HT
  let margeHt = Number(prixVenteHtGet) - Number(prixAchatHtGet);

  //CREATION DE L'OBJET BOISSON
  let boisson;
  if (typeBoissonGet == "boissonSansAlcool") {
    // Calcul TTC Sans Alcool TVA 5.5%

    let ttcSansAlcool = Math.round(Number(prixVenteHtGet) * 1.055 * 100) / 100;
    boisson = new BoissonSansAlcool(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      ttcSansAlcool,
      margeHt,
      typeBoissonGet
    );
  } else {
    // Calcul TTC Alcool TVA 10%
    let ttcAlcool = Math.round(Number(prixVenteHtGet) * 1.1 * 100) / 100;
    console.log(ttcAlcool);
    boisson = new BoissonAlcoolisée(
      nomBoissonGet,
      quantiteGet,
      prixAchatHtGet,
      prixVenteHtGet,
      ttcAlcool,
      margeHt,
      typeBoissonGet,
      degreeAlcoolGet
    );
  }
  console.log(boisson);

  //ENVOI DE L'OBJET CONTACT DANS LE TABLEAU AVEC LA METHODE PUSH
  arrayStock.push(boisson);
  //TRANSFORMATION DE MON TABLEAU EN CHAINE DE CARACTERE */
  // let jsonArrayStock = JSON.stringify(arrayStock);
  localStorage.setItem("@stocks", JSON.stringify(arrayStock));
  formulaire.reset();
  // APPEL DE LA FONCTION showBoisson
  showStock(formData);
  console.log(boisson);
});

// arrayStock[index].nomDeLaValeur = NewValeurInput
// recreer un nouveau local storage

function showStock(formData) {
  //Création de la fonction showStock avec la méthode forEach()
  //Création de la variable content
  let contentStock = "";
  arrayStock.forEach(function (element) {
    console.log(element);
    //Ajout à la variable content de mon élément
    // enteteTableau
    // contentStock.appendChild(enteteTableau);
    contentStock += `
    <tr>
    <td colspan="1"><input class="modifNom inputStock" type="text" value="${element.nom}"/></td>
    <td colspan="1"><input class="modifType inputStock" type="text" value="${element.type}"/></td>
    <td colspan="1"><input class="modifDegre inputStock" type="text" value="${element.degre}"/></td>
    <td colspan="1"><input class="modifQuantite inputStock" type="number" min="0" max="10" value="${element.quantite}"/></td>
    <td colspan="1"><input class="modifPrixAchatHT inputStock" type="text" value="${element.prixAchatHt}"/></td>
    <td colspan="1"><input class="modifPrixVenteHT inputStock" type="text" value="${element.prixVenteHt}"/></td>
    <td colspan="1"><input class="modifMarge inputStock" type="text" value="${element.marge}"/></td>
    <td colspan="1"><input class="modifPrixVenteTTC inputStock" type="text" value="${element.prixVenteTtc}"/></td>
    <td colspan="1"><button class="deleteButton">Supprimer</button></td>
    <td colspan="1"><button class="modifBtn">Enr. Modif</button></td>
    <td colspan="1"><button class="QRcode">QR Code</button></td>
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

  enrModifBtn();

  function enrModifBtn() {
    let modifNom = document.querySelectorAll(".modifNom");
    let modifQuantite = document.querySelectorAll(".modifQuantite");
    let modifPrixAchatHT = document.querySelectorAll(".modifPrixAchatHT");
    let modifPrixVenteHT = document.querySelectorAll(".modifPrixVenteHT");
    let modifType = document.querySelectorAll(".modifType");
    let modifDegre = document.querySelectorAll(".modifDegre");
    let btnEnrModif = document.querySelectorAll(".modifBtn");

    console.log(btnEnrModif);
    btnEnrModif.forEach(function (element, index) {
      element.addEventListener("click", function () {
        alert("cc");
        modifNom.forEach(function (element, index) {
          arrayStock[index].nom = element.value;
        });
        modifQuantite.forEach(function (element, index) {
          arrayStock[index].quantite = element.value;
        });
        modifPrixAchatHT.forEach(function (element, index) {
          arrayStock[index].prixAchatHt = element.value;
        });
        modifPrixVenteHT.forEach(function (element, index) {
          arrayStock[index].prixVenteHt = element.value;
        });
        modifType.forEach(function (element, index) {
          arrayStock[index].type = element.value;
        });
        modifDegre.forEach(function (element, index) {
          arrayStock[index].degre = element.value;
        });
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
      });
    });
  }

  let modifNom = document.querySelectorAll(".modifNom");

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

  modifQuantite.forEach(function (element, index) {
    element.addEventListener("change", function (e) {
      if (element.value < 5) {
        element.fontWeight = "bolder";
        element.style.color = "red";
        alert(`Vous devriez penser à passer commande!`);
      } else {
        element.fontWeight = "bolder";
        element.style.color = "green";
      }
    });
  });

  let modifPrixAchatHT = document.querySelectorAll(".modifPrixAchatHT");

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

  // let modifPrixVenteTTC = document.querySelectorAll(".modifPrixVenteTTC");
  // console.log(modifPrixVenteTTC);
  // modifPrixVenteTTC.forEach(function (element, index) {
  //   element.addEventListener("keydown", function (e) {
  //     if (e.key == "Enter") {
  //       console.log(element.value);
  //       arrayStock[index].prixVenteTtc = element.value;
  //       let indexE = arrayStock[index.element];
  //       console.log(indexE + " element modifié du tableau");
  //       console.log(arrayStock);
  //       localStorage.setItem("@stocks", JSON.stringify(arrayStock));
  //       showStock();
  //     } else {
  //       false;
  //     }
  //   });
  // });

  let modifType = document.querySelectorAll(".modifType");


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
    type
  ) {
    super(nom, quantite, prixAchatHt, prixVenteHt, prixVenteTtc, marge);
    this.type = type;
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
    type,
    degreAlcool
  ) {
    super(nom, quantite, prixAchatHt, prixVenteHt, prixVenteTtc, marge);
    this.type = type;
    this.degre = degreAlcool;
  }
}
// console.log("Boisson alcoolisée");

//GESTION DU BOUTON TYPE DE BOISSON. FAIRE APPARAITRE L'INPUT DEGRE D'ALCOOL SI INPUT ALCOOL CHOISI
