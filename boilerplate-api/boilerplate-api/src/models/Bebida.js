import mongoose from "mongoose";

const schemaBebida = new mongoose.Schema(
    {
        nome:{type:String,
            required:[true,"o nome da bebida é obrigatório."],
            trim:true
        },
        tipo:{
            type:String,
            required:[true,"O tipo da bebida é obrigatorio."],
            trim:true
        },
        categoriaBacklog:{
            type:String,
            enum:{
                values:["Aguardo","Lixo","Pratilheira"],
                message:"A categoria deve ser Aguardo,Lixo ou Pratilheira."
            },
            default:"Aguardo"
        },
        preco:{
            type:Number,
            required:[true,"O preço da bebida é obrigatorio."],
            min:[0,"O preoc não pode ser negativo."]
        },
        emDesconto:{
            type:Boolean,
            default:false
        },
        percentualDesconto:{
            type:Number,
            default:0,
            min:[0,"O desconto naõ pode ser menor que 0%."],
            max:[100,"O desconto não pode ser mais que 100%."]
        },
        possibilidadesDrinks:{
            type:[String],
            default:[]
        },
        combinacoesComidas:{
            type:[String],
            default:[]
        },
        mediaNota:{
            type:Number,
            default:0,
            min:0,
            max:10
        },
        totalAvaliacoes:{
            type:Number,
            default:0,
            min:0
        },
        descricao:{
            type:String,
            trim:true
        }
    },
    {timestamps: true}
)

schemaBebida.virtual("precoFinal").get(function(){
    if (!this.emDesconto || this.percentualDesconto <= 0){
        return this.preco
    }
    const valorDesconto = (this.preco * this.percentualDesconto)/100
    return Number((this.preco - valorDesconto).toFixed(2))
})

schemaBebida.set("toJSON",{virtuals:true})
schemaBebida.set("toObject",{virtuals:true})

const Bebida = mongoose.model("Bebida", schemaBebida);
export default Bebida



