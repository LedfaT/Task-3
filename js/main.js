import { getJSON } from "./helpers";
import { API_URL } from "./config";

import "core-js/stable";
import "regenerator-runtime/runtime";

class App {
  #data;
  #parentEl = document.querySelector(".main__table").querySelector("tbody");
  #form = document.querySelector(".form");
  #recoveryBtn = this.#form.querySelector(".recover-btn");
  #dataOnPage = 0;
  #input = this.#form.querySelector("input");
  #saved = [];
  #errMessasge = "No country found!!! Try again.";

  constructor() {
    this.#getLocalStorage();
    this.#save();
    this.#recoverData();
    this.#getCountry();
  }

  #save() {
    this.#parentEl.addEventListener("click", (e) => {
      if (!e.target.matches("input") || !this.#data) return;

      const index = +e.target.closest("tr").querySelector("th").textContent - 1;
      if (e.target.checked !== true) {
        this.#saved.splice(index, 1);
        this.#setLocalStorage();

        return;
      }

      this.#data[index].checked = true;
      this.#saved.push(this.#data[index]);
      this.#setLocalStorage();
    });
  }

  #getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("saved"));
    if (!data) return;
    this.#saved = data;
    this.#renderSaved();
  }

  #setLocalStorage() {
    localStorage.setItem("saved", JSON.stringify(this.#saved));
  }

  #recoverData() {
    this.#recoveryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.#input.value = "";
      this.#parentEl.innerHTML = "";
      this.#dataOnPage = 0;
      this.#renderSaved();
    });
  }

  #getCountry() {
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();
      const country = this.#input.value;
      this.#dataOnPage = 0;

      if (!country) {
        this.#renderError();
        return;
      }

      this.bringData(country);
      this.#renderSaved();
      this.#renderUni();
    });
  }

  #renderSaved() {
    const saved = this.#saved
      .map((uni, i) => {
        this.#dataOnPage++;
        return `
                          <tr>
                              <th scope="row">${this.#dataOnPage}</th>
                              <td>${uni.country}</td>
                              <td>${uni.name}</td>
                              <td>
                              <a href="${uni.web_pages[0]}">${uni.web_pages}</a>
                           </td>
                              <td>${uni.alpha_two_code}</td>
                              <td>${uni.domains[0]}</td>
                               <td><input type="checkbox" checked/></td>
                          </tr>
                      `;
      })
      .join("");
    this.#parentEl.innerHTML = "";
    this.#parentEl.insertAdjacentHTML("beforeend", saved);
  }

  #renderUni() {
    const HTML = this.#data
      .map((uni, i) => {
        this.#dataOnPage++;
        return `
                        <tr>
                            <th scope="row">${this.#dataOnPage}</th>
                            <td>${uni.country}</td>
                            <td>${uni.name}</td>
                            <td>
                            <a href="${uni.web_pages[0]}">${uni.web_pages}</a>
                         </td>
                            <td>${uni.alpha_two_code}</td>
                            <td>${uni.domains[0]}</td>
                             <td><input type="checkbox" /></td>
                        </tr>
                    `;
      })
      .join("");

    this.#parentEl.insertAdjacentHTML("beforeend", HTML);
  }

  bringData = async (cont) => {
    try {
      const universities = await getJSON(`${API_URL}=${cont}`);
      this.#data = universities;

      this.#data = this.#data.filter((el) => el.name !== this.#saved.name);

      this.#data.forEach((el) => {
        el.checked = false;
      });

      if (this.#data.length === 0) {
        this.#renderError();
        return;
      }
    } catch (err) {}
  };

  #renderError() {
    const err = <p class="error">${this.#errMessasge}</p>;
    console.log(err);
    this.#parentEl.innerHTML = "";
    this.#parentEl.insertAdjacentHTML("beforeend", err);
  }
}

const app = new App();
