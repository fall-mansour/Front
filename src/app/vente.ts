export class Vente{

    constructor(
        public description:string,
        public img:string,
        public date:Date,
        public nom:string,
        public adresse:string,
        public telephone:number,
        public prix:number,
        public nblikes:number=0,
    ){

    }

}