let globalUsers = [];
let globalFilteredUsers = [];

let tabPeopleSearch = null;
let tabStatistic = null;
let input = null;


let globalEstatistic = {
  masculino : 0,
  feminino : 0,
  sumAges : 0,
  medAges :0
};


let titlePeopleSearch = null;
let titleStastistic = null;


window.addEventListener('load', ()=>{
  tabPeopleSearch = document.querySelector('#tabPeopleSearch');
  tabStatistic = document.querySelector('#tabStatistic');
  
  titlePeopleSearch = document.querySelector('#titlePeopleSearch');  

  titleStastistic = document.querySelector('#titleStastistic');


  buttonSearch = document.querySelector('#btnSearch');
  buttonSearch.addEventListener('click', () => searchPeople() );

  input = document.querySelector('#nameSearch');
  input.addEventListener('keyup', handlerInputKey )

  fetchPeopleAsync();

});

function handlerInputKey({ key }) {
  
  if(key === 'Enter'){
    searchPeople();
  }
    

}

async function fetchPeopleAsync(){
  const response = await fetch('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await response.json();
  
  // console.log(json.results);

  globalUsers = json.results.map(person => {

    const {name, picture, dob, gender} = person;
    return {
      name: name.first,
      nameLast: name.last,
      completeName: name.first.toLowerCase() + " " + name.last.toLowerCase(),
      photo: picture.large,
      age: dob.age,
      gender
    }
  });
  globalFilteredUsers = globalUsers;
  render();
}

function searchPeople(){
  inputSearch = input.value.toLowerCase().trim();
  
  console.log(inputSearch);

  globalFilteredUsers = globalUsers
  .filter((people) => {
    return people.completeName.includes(inputSearch);
   });
  
  render();
}

function render(){
  let peopleHTML = '<div>'
  globalFilteredUsers.forEach(person => {
   const { name, nameLast, photo, age, gender  } = person
   const personHTML =
    ` <div class="people">
          <div>
            <img class="flag" src="${photo}" alt="${name}" title="${name}">
          </div>
          <div>
            <span> ${name} ${nameLast}, ${age} anos </span>
          </div>
    </div>
    `

    peopleHTML += personHTML;
  });
  tabPeopleSearch.innerHTML = peopleHTML;

  renderTitlePeople();
  renderTitleStastistic();
}

function renderTitlePeople(){
  const countPeople = globalFilteredUsers.length;
  let singText = " usuário encontrado";
  let pluText = " usuários encontrados";

  if(countPeople === globalUsers.length){
    titlePeopleSearch.textContent = "Nenhum usuário filtrado";
    return;
  }

  if(countPeople > 1)  {
    titlePeopleSearch.textContent = `${countPeople} ${pluText}`;
  }else{
    titlePeopleSearch.textContent = `${countPeople} ${singText}`;
  }            

}

function renderTitleStastistic(){
  titleStastistic.textContent = "Estatísticas";
  calculaSexo();
  calculaSoma();
  calculaMedia();

  const divEstat = 
  `<div class="chipList">
    <div class="chip">
      Sexo masculino: <b>${globalEstatistic.masculino}</b>
    </div>
    <div class="chip">
      Sexo feminino: <b>${globalEstatistic.feminino}</b>
    </div>
    <div class="chip">
      Soma das idades: <b>${globalEstatistic.sumAges}</b>
    </div>
    <div class="chip">
      Média das idades: <b>${globalEstatistic.medAges}</b>
    </div>
   </div>
  
  `;
  
  tabStatistic.innerHTML = divEstat;
}

function calculaSexo(){
  let masc = 0;
  let femi = 0;

  globalFilteredUsers.forEach((sexo) =>{
      if(sexo.gender === 'male')
          masc +=1;

      if(sexo.gender === 'female')
        femi +=1;
  });

  globalEstatistic.masculino = masc;
  globalEstatistic.feminino = femi;

}

function calculaSoma(){
  globalEstatistic.sumAges = globalFilteredUsers.reduce((acumulated, current)=>
  {
    return acumulated + current.age;
  },0);
}

function calculaMedia(){
  globalEstatistic.medAges = 
            parseFloat((globalEstatistic.sumAges / globalFilteredUsers.length).toFixed(2));

  console.log(globalEstatistic);
}
