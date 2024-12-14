import { getJSON } from "./helpers";
import { API_URL } from "./config";

class App {
  #data;
  #parentEl = document.querySelector(".main__table").querySelector("tbody");
  form = document.querySelector(".form");
  #errMessasge = "No country found!!! Try again";
  constructor() {
    this.getCountry();
  }

  getCountry() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = this.form.querySelector("input");
      const country = input.value;
      input.value = "";
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
