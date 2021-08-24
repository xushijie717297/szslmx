
import urlClass from "../../components/js/UrlClass"
import axios from "axios"
import global from "../../components/js/Global"
import Bus from "../../utils/Bus"
class Methods{
    var aa = Bus.$on("data",res)=>{
        console.log(JSON.stringify(res))
    }
    console.log(aa)
}
export default new Methods()