const show = async function name() {
  try {
    const newVar = await fetch(
      "http://universities.hipolabs.com/search?country=ukraine"
    );
    const data = await newVar.json();
    return data;
  } catch (err) {
    alert(err);
  }
};

const universities = show();
console.log(universities);
