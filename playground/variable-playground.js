var person={
	name: 'Vivek',
	age: 30
};

updatePerson = function(obj){
	obj.age=35;
}

updatePerson(person);
console.log(person);

//Array Example
var gradesArr = [35, 39];

addGrade = function(arr){
	arr.push(43);
	debugger;
}
addGrade(gradesArr);
console.log(gradesArr);