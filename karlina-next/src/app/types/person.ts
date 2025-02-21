export  interface PersonModel{
  id:number,
  name:string,
  address:string,
  phone:string,
  deletePerson:(id: number)=> void;
}

export interface PersonAddModel{
  name:string,
  adress:string,
  phone:string,
}
