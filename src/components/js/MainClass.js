import XLSX from "xlsx";
import FileSaver from "file-saver";
class Methods{
    /**
     * 生成number个随机的大写字母
     * @param {*} number 
     */
    GetRanLetterString(number) {
        var result = "";
        for (var i = 0; i < number; i++) {
          result += String.fromCharCode(65 + this.GetRanNum());
        }
        return result;
      }
      /**
       * 获取一个0-25的随机数
       */
      GetRanNum() {
        var ranNum;
        for (var i = 0; i < 4; i++) {
          ranNum = Math.ceil(Math.random() * 25);
        }
        return Number(ranNum);
      }
       ObjectDepthCopy(object) {
         var data = object;
         var str = JSON.stringify(data);
         var result = JSON.parse(str);
         return result;
       }
       ExportExcelMain(tableDome) {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(document.querySelector(tableDome));
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "sheet.xlsx"
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
      }
      gradientColors(start, end, steps, gamma) {
        var i, j, ms, me, output = [], so = [];
        gamma = gamma || 1;
        var normalize = function (channel) {
          return Math.pow(channel / 255, gamma);
        };
        var parseColor = function (hexStr) {
          return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) { return 0x11 * parseInt(s, 16); }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) { return parseInt(s, 16); });
        };
        var pad = function (s) {
          return (s.length === 1) ? '0' + s : s;
        };
        start = parseColor(start).map(normalize);
        end = parseColor(end).map(normalize);
        for (i = 0; i < steps; i++) {
          ms = i / (steps - 1);
          me = 1 - ms;
          for (j = 0; j < 3; j++) {
          so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
          }
          output.push('#' + so.join(''));
        }
        return output;
      };
}
export default new Methods()