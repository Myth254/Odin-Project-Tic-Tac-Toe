const superHeroes = {
  "squadName": "Super hero squad",
  "homeTown": "Metro City",
  "formed": 2016,
  "secretBase": "Super tower",
  "active": true,
  "members": [
    {
      "name": "Molecule Man",
      "age": 29,
      "secretIdentity": "Dan Jukes",
      "powers": ["Radiation resistance", "Turning tiny", "Radiation blast"]
    },
    {
      "name": "Madame Uppercut",
      "age": 39,
      "secretIdentity": "Jane Wilson",
      "powers": [
        "Million tonne punch",
        "Damage resistance",
        "Superhuman reflexes"
      ]
    },
    {
      "name": "Eternal Flame",
      "age": 1000000,
      "secretIdentity": "Unknown",
      "powers": [
        "Immortality",
        "Heat Immunity",
        "Inferno",
        "Teleportation",
        "Interdimensional travel"
      ]
    }
  ]
}

console.log(superHeroes.homeTown)
console.log(superHeroes.members[1].powers[2])

const someJSON = '{"name":"John", "age":30, "city":"New York"}';
console.log(someJSON)
const obj = JSON.parse('{"name":"John", "age":30, "city":"New York"}');
console.log(obj)

const obj2 = {name: "John", age: 30, city: "New York"};
const myJSON = JSON.stringify(obj2);
console.log(myJSON)

const arr = ["John", "Peter", "Sally", "Jane"];
const myarrJSON = JSON.stringify(arr);
console.log(myarrJSON)