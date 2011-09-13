var poo = "pa"
cool = function(){
    this.a = "fizzle";
    this.bizzle = function(){
        this.a="bizzle"
    };
    this.printa = function(){
        console.log(this.a);
    };
}







exports.cool = cool