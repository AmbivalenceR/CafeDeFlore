function principaleFlore() {
  // RECUPERATION DES ELEMENTS INPUTS //
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
    if (inputTypeBoisson.value == "BoissonAlcoolisée") {
      inputDegre.style.display = "";
      inputDegre.value = "";
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
      let ttcSansAlcool = Number(prixVenteHtGet) * 1.055;
      // Boisson = heritante BoissonSansAlcool
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
      let ttcAlcool = Number(prixVenteHtGet) * 1.1;
      // Boisson = heritante BoissonAlcoolisée
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

    //ENVOI DE L'OBJET CONTACT DANS LE TABLEAU AVEC LA METHODE PUSH
    arrayStock.push(boisson);

    //TRANSFORMATION DE MON TABLEAU EN CHAINE DE CARACTERE */
    localStorage.setItem("@stocks", JSON.stringify(arrayStock));
    formulaire.reset();

    // APPEL DE LA FONCTION showBoisson
    showStock();
  }); // Fin fourmulair.addEventListener // Fin fourmulair.addEventListener

  // Création de la fonction showStock
  function showStock() {
    //Création de la variable content
    let contentStock = "";

    arrayStock.forEach(function (element) {
      // Ajout des valeurs des objets boisson dans un tableau
      contentStock += `
    <tr id="content">
    <td colspan="1"><input class="modifNom inputStock" type="text" value="${element.nom}"/></td>
    <td colspan="1"><input class="modifType inputStock" type="text" value="${element.type}"/></td>
    <td colspan="1"><input class="modifDegre inputStock" type="text" value="${element.degre}"/></td>
    <td colspan="1"><input class="modifQuantite inputStock" type="number" min="0" max="10" value="${element.quantite}"/></td>
    <td colspan="1"><input class="modifPrixAchatHT inputStock" type="text" value="${element.prixAchatHt}"/></td>
    <td colspan="1"><input  class="modifPrixVenteHT inputStock" type="text" value="${element.prixVenteHt}"/></td>
    <td colspan="1"><input disabled class="modifMarge inputStock" type="text" value="${element.marge}"/></td>
    <td colspan="1"><input disabled class="modifPrixVenteTTC inputStock" type="text" value="${element.prixVenteTtc}"/></td>
    <td colspan="1"><button class="deleteButton">Supprimer</button></td>
    <td colspan="1"><button class="modifBtn">Enr. Modif</button></td>
    <td colspan="1"><button type="button" class="btn btn-default QRcode" id="generate">
              QRcode
            </button></td>
    </tr>`;
    });

    // affichage du tableau dans la divTableauStock
    divTableauStock.innerHTML = contentStock;

    // Fonctionnalité du bouton Supprimer
    let deleteBtn = document.querySelectorAll(".deleteButton");
    deleteBtn.forEach(function (element, index) {
      element.addEventListener("click", function () {
        arrayStock.splice(index, 1);
        localStorage.setItem("@stocks", JSON.stringify(arrayStock));
        showStock();
      });
    }); // Fin arrayStock.forEach // Fin arrayStock.forEach

    // Appel de la fonction pour afficher le QR code au click du bouton "QRcode"
    affichageQRcode();

    // Appel de la fonction pour enregistrer les modifications apportées via le bouton
    enregistrerModifBtn();
    // Appel de la fonction pour enregistrer les modifications apportées via les input
    modificationInputDirect();

    function enregistrerModifBtn() {
      let modifNom = document.querySelectorAll(".modifNom");
      let modifQuantite = document.querySelectorAll(".modifQuantite");
      let modifPrixAchatHT = document.querySelectorAll(".modifPrixAchatHT");
      let modifPrixVenteHT = document.querySelectorAll(".modifPrixVenteHT");
      let modifType = document.querySelectorAll(".modifType");
      let modifDegre = document.querySelectorAll(".modifDegre");
      let btnEnrModif = document.querySelectorAll(".modifBtn");

      btnEnrModif.forEach(function (element, index) {
        element.addEventListener("click", function () {
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
    function modificationInputDirect() {
      let modifNom = document.querySelectorAll(".modifNom");
      modifNom.forEach(function (element, index) {
        element.addEventListener("keydown", function (e) {
          if (e.key == "Enter") {
            arrayStock[index].nom = element.value;
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
            arrayStock[index].quantite = element.value;
            localStorage.setItem("@stocks", JSON.stringify(arrayStock));
            showStock();
          } else {
            false;
          }
        });
      });

      modifQuantite.forEach(function (element, index) {
        element.addEventListener("change", function (e) {
          if (element.value < 5 && element.value >= 3) {
            element.style.color = "orange";
          } else if (element.value < 3) {
            alert(`Vous devriez penser à passer commande !`);
            element.style.color = "red";
          } else {
            false;
          }
        });
      });

      let modifPrixAchatHT = document.querySelectorAll(".modifPrixAchatHT");

      modifPrixAchatHT.forEach(function (element, index) {
        element.addEventListener("keydown", function (e) {
          if (e.key == "Enter") {
            console.log(element.value);
            arrayStock[index].prixAchatHt = element.value;
            // A la modification du prix d'achat HT, la MARGE se recalcule //
            arrayStock[index].marge =
              arrayStock[index].prixVenteHt - arrayStock[index].prixAchatHt;
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
            // A la modification du prix de vente HT, la MARGE se recalcule //
            arrayStock[index].marge =
              arrayStock[index].prixVenteHt - arrayStock[index].prixAchatHt;
            // A la modification du prix de vente HT, le PRIX VENTE TTC se recalcule //
            // Si Boisson Alcoolisée, une TVA de 10% s'applique //
            if (arrayStock[index].type == "BoissonAlcoolisée") {
              arrayStock[index].prixVenteTtc =
                arrayStock[index].prixVenteHt * 1.1;
              console.log("BA");
            }
            // Si Boisson Sans Alcool, une TVA de 5.5% s'applique //
            else if (arrayStock[index].type == "BoissonSansAlcool") {
              arrayStock[index].prixVenteTtc =
                arrayStock[index].prixVenteHt * 1.055;
              console.log("BSA");
            }
            // Sinon RIEN //
            else {
              console.log("Bye");
            }
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

      modifType.forEach(function (element, index) {
        element.addEventListener("keydown", function (e) {
          if (e.key == "Enter") {
            arrayStock[index].type = element.value;
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
            arrayStock[index].degre = element.value;
            localStorage.setItem("@stocks", JSON.stringify(arrayStock));
            showStock();
          } else {
            false;
          }
        });
      });
    }
  } // Fin function showStock // Fin function showStock

  //GESTION DU BOUTON TYPE DE BOISSON. FAIRE APPARAITRE L'INPUT DEGRE D'ALCOOL SI INPUT ALCOOL CHOISI

  // QRcode //
  function affichageQRcode() {
    // EVENT POUR FERMER L'AFFICHAGE DU QR CODE
    let buttonQRcode = document.querySelectorAll(".QRcode");
    buttonQRcode.forEach(function (element, index) {
      element.addEventListener("click", function () {
        let divQRcode = document.querySelector(".container-fluid");
        divQRcode.setAttribute("style", "display: block;");
        let btnX = document.querySelector(".btnXforQRcode");
        btnX.addEventListener("click", function () {
          divQRcode.style.display = "none";
        });
        function htmlEncode(value) {
          return $("<div/>").text(value).html();
        }
        let contentQRcode = `

    ${arrayStock[index].nom}
    Type de boisson : ${arrayStock[index].type}
    Degré d'alcool : ${arrayStock[index].degre}
    Quantité restante : ${arrayStock[index].quantite}
    Prix de vente : ${arrayStock[index].prixVenteTtc} €
    `;
        $(".qr-code").attr(
          "src",
          "https://chart.googleapis.com/chart?cht=qr&chl=" +
            htmlEncode(contentQRcode) +
            "&chs=160x160&chld=L|0"
        );
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
}

principaleFlore();
