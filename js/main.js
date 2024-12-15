import { getJSON } from "./helpers";
import { API_URL } from "./config";

import "core-js/stable";
import "regenerator-runtime/runtime";

class App {
  #data;
  #parentEl = document.querySelector(".main__table").querySelector("tbody");
  #form = document.querySelector(".form");
  #recoveryBtn = this.#form.querySelector(".recover-btn");
  #input = this.#form.querySelector("input");
  #saved = [];
  #errMessasge = "No country found!!! Try again.";

  constructor() {
    this.#save();
    this.#recoverData();
    this.#getCountry();
  }

  #save() {
    this.#parentEl.addEventListener("click", (e) => {
      if (!e.target.matches("input") || !this.#data) return;

      const index = +e.target.closest("tr").querySelector("th").textContent - 1;
      this.#data[index].checked = true;
      if (e.target.checked === true) this.#saved.push(this.#data[index]);
      console.log(this.#saved);
    });
  }

  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("saved"));
    if (!data) return;
    this.#saved = data;
  }

  #setLocalStorage() {
    localStorage.setItem("saved", JSON.stringify(this.#saved));
  }

  #recoverData() {
    this.#recoveryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.#input.value = "";
      this.#parentEl.innerHTML = "";
    });
  }

  #getCountry() {
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();
      const country = this.#input.value;
      if (!country) {
        this.#renderError();
        return;
      }
      this.render(country);
    });
  }

  render = async (cont) => {
    try {
      const universities = await getJSON(`${API_URL}=${cont}`);
      this.#data = universities;
      this.#data.forEach((el) => {
        el.checked = false;
      });

      if (this.#data.length === 0) {
        this.#renderError();
        return;
      }

      const HTML = universities
        .map(
          (uni, i) => `
                            <tr>
                                <th scope="row">${i + 1}</th>
                                <td>${uni.country}</td>
                                <td>${uni.name}</td>
                                <td>
                                <a href="${uni.web_pages[0]}">${
            uni.web_pages
          }</a>
                             </td>
                                <td>${uni.alpha_two_code}</td>
                                <td>${uni.domains[0]}</td>
                                 <td><input type="checkbox" /></td>
                            </tr>
                        `
        )
        .join("");

      this.#parentEl.innerHTML = "";
      this.#parentEl.insertAdjacentHTML("beforeend", HTML);
    } catch (err) {
      console.log(err);
    }
  };

  #renderError() {
    const err = ` <p class="error">${this.#errMessasge}</p>`;
    console.log(err);
    this.#parentEl.innerHTML = "";
    this.#parentEl.insertAdjacentHTML("beforeend", err);
  }
}

const app = new App();
