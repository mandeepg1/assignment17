let games = [];
const addGame = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-edit-game-form");
  const formData = new FormData(form);
  formData.append("platform", getGameInfo());
  let response;

  try {
      if (form._id.value && form._id.value !== "-1") {
          response = await fetch(`/api/games/${form._id.value}`, {
              method: "PUT",
              body: formData,
          });
      } else {
          formData.delete("_id");
          response = await fetch("/api/games", {
              method: "POST",
              body: formData,
          });
      }

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Data from server:", data);

      const updatedGameIndex = games.findIndex((g) => g._id === data._id);
      if (updatedGameIndex !== -1) {
          games[updatedGameIndex] = data;
          console.log("Games Array Updated:", games);
          showGames();
      }
  } catch (error) {
      console.error("Error:", error);
  }

  document.querySelector(".form-class").classList.add("transparent");
  showGames();
  reloadPage();
};

  
  const getGameInfo = () => {
    const inputs = document.querySelectorAll("#game-boxes input");
    const infos = [];
    inputs.forEach((input) => {
      infos.push(input.value);
    });
    return infos;
  };
  
  const getGames = async () => {
    try {
      return (await fetch("api/games/")).json();
    } catch (error) {
      console.log(error);
    }
  };
  
  const showGames = async () => {
    let games = await getGames();
    
    let gameCol = document.getElementById("game-col");
    gameCol.innerHTML = "";
  
    games.forEach((game) => {
      const section = document.createElement("section");
      section.classList.add("items");
      gameCol.append(section);
  
      const a = document.createElement("a");
      a.href = "#";
      section.append(a);
  
      const h4 = document.createElement("h4");
      h4.innerHTML = game.name;
      a.append(h4);
  
      a.onclick = () => {
        displayGameDetails(game);
      };
    });
  };
  
  const displayGameDetails = (game) => {
    const details = document.getElementById("game-details");
    details.innerHTML = "";
  
    const img = document.createElement("img");
    img.src = game.img;
    img.classList.add("game-img");
    details.append(img);
  
    const h4 = document.createElement("h4");
    details.append(h4);
  
    const p = document.createElement("p");
    details.append(p);
  
    h4.innerHTML = game.description;
    p.innerHTML =
      "Platform: " +
      game.platform.join(", ") +
      "<br> Publisher: " +
      game.publisher + 
      "<br> Extra Info: " + 
      game.add_info;

    const dLink = document.createElement("a");
    dLink.innerHTML = "&#x2715;";
    details.append(dLink);
    dLink.id = "delete-link";
  
    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    details.append(eLink);
    eLink.id = "edit-link";
  
    eLink.onclick = (e) => {
      e.preventDefault();
      document.getElementById("add-section").classList.remove("transparent");
      document.getElementById("add-games").innerHTML = "<u>Edit Game</u>";
    };
  
    dLink.onclick = (e) => {
      e.preventDefault();
      deleteGame(game);
    };

    populateEditForm(game || {});
  };
  
  const addGameBoxes = (e) => {
    e.preventDefault();
    const gameBoxes = document.getElementById("game-boxes");
    const input = document.createElement("input");
    input.type = "text";
    gameBoxes.append(input);
  };

  const populateEditForm = (game) => {
    const form = document.getElementById("add-edit-game-form");
    form._id.value = game._id;
    form.name.value = game.name;
    form.description.value = game.description;
    form.platform.value = game.platform;
    form.publisher.value = game.publisher;
    
    const addInfoInput = document.createElement("input");
    addInfoInput.type = "text";
    addInfoInput.value = game.add_info;
    addInfoInput.name = "add_info";

    populateInfo(game);
};


const populateInfo = (game) => {
    const section = document.getElementById("game-boxes");

    game.add_info.forEach((info) => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = info;
        section.append(input);
    });
}


const addEditGame = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-edit-game-form");
  const formData = new FormData(form);
  let response;
  formData.append("infos", getGameInfo());

  if (form._id.value == -1) {
      formData.delete("_id");

      response = await fetch("/api/games", {
          method: "POST",
          body: formData,
      });
  } else {
      console.log(...formData);

      response = await fetch(`/api/games/${form._id.value}`, {
          method: "PUT",
          body: formData,
      });
  }

  if (response.status != 200) {
      console.log("Error posting data");
  }

  recipe = await response.json();

  if (form._id.value != -1) {
      displayGameDetails(game);
  }

  resetForm();
  document.querySelector("add-section").classList.add("transparent");
  showGames();
  reloadPage();
};

const reloadPage = () => {
  location.reload();
};

  const deleteGame = async(game) => {
    let response = await fetch(`/api/games/${game._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
    });  
  
    if (response.status != 200) {
        console.log("error deleting");
        return;
    }
  
    let result = await response.json();
    showGames();
    document.getElementById("game-details").innerHTML = "";
    resetForm();
  }

  const resetForm = () => {
    const form = document.getElementById("add-edit-game-form");
    form.reset();
    form.elements['_id'].value == "-1";
    document.getElementById("game-boxes").innerHTML = "";
  };
  
  window.onload = () => {
    showGames();
    document.getElementById("add-section").classList.add("transparent");
  
    document.getElementById("add-game-intro").addEventListener("click", () => {
      document.getElementById("add-section").classList.remove("transparent");
    });
  
    document.getElementById("add-game-link").onclick = addGameBoxes;
    document.getElementById("add-edit-game-form").onsubmit = addGame;
  };