var groups = execution.getVariable("product_table")
var payment_term = execution.getVariable("payment_term")
var myJson = JSON.parse(groups)
var k = {}
var l = []
var profit = 0
var product_id = ""
var product = ""
var calProfit = 0
var type_product = execution.getVariable("type_product")
execution.setVariable("len", myJson.length)
execution.setVariable("skipDraft", true)


for (var i = 0; i < myJson.length; i++) {
    for (var key in myJson[i]) {
        if (key != "credit_date") {
            if (parseFloat(myJson[i][key]) % 1 === 0) {
                myJson[i][key] = parseInt(myJson[i][key])
            }
        }
        if (key == "ship_type") {
            if (myJson[i].ship_type.name == "ลูกค้ารับเอง") {
                myJson[i].shipping = 0
            }

        }
        if (key == "products") {
            k.p = myJson[i][key].name
            product = myJson[i][key].name
        }
        else if (key == 'products_id') {
            k.p_id = myJson[i][key].name
            product_id = myJson[i][key].name
        }
        else if (key == "treasury_id") {
            k.t = myJson[i][key].name
        }
        else if (key == "cost") {
            k.c = myJson[i][key]
        }
        else if (key == "credit_date") {
            k.cd = myJson[i][key]
            if (payment_term == 'Y000') {
                k.sd = 0
            } else {
                if (k.cd.search('/') == -1) {
                    k.sd = k.cd
                } else {
                    var jj = k.cd.split("/")
                    k.sd = parseInt(parseInt(jj[0]) / 2 + parseInt(jj[1])).toString()
                }
            }
        }
        else if (key == "interest") {
            k.i = myJson[i][key] + "%"
        }
        else if (key == "e_investment") {
            k.ei = myJson[i][key]
        }
        else if (key == "price") {
            k.pi = myJson[i][key]
        }
        else if (key == "shipping") {
            k.sh = myJson[i][key]
        }
    }
    Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
        return this.toString().split(".")[1].length || 0; 
    }
    var priceCheckLengthDecimal = parseFloat(myJson[i].price)
    
    myJson[i].SellingPrice = (parseFloat(myJson[i].shipping) + parseFloat(myJson[i].price)).toFixed(priceCheckLengthDecimal.countDecimals())
    k.si = (parseFloat((myJson[i].interest)) * k.sd * parseFloat(k.c) / 365 / 100).toFixed(2)
    if (parseFloat(k.si) === 0) {
        k.si = "0"
    }
    calProfit = (parseFloat(k.pi) - parseFloat(k.c) - k.si - parseFloat(k.ei))
    k.pr = calProfit.toFixed(priceCheckLengthDecimal.countDecimals())
    if (parseFloat(calProfit.toFixed(2)) === 0) {
        k.pr = "0"
    }
    if (i === 0) {
        profit = calProfit.toFixed(2)
    }
    else {
        if (k.pr < profit) {
            profit = calProfit.toFixed(2)
        }
    }
    l[i] = k
    k = {}
}
execution.setVariable("profit", profit)
execution.setVariable("p_id", product_id)
execution.setVariable("p", product)
execution.setVariable("product_table", JSON.stringify(myJson))
execution.setVariable("customtable", JSON.stringify(l))

var dd = new Date(execution.getVariable("since_date"))
var MM = dd.getDate() + "/" + (dd.getMonth() + 1) + "/" + dd.getFullYear()
var days = dd.getDate() + " " + workflowUtils.getThaiMonth(MM) + " " + (dd.getFullYear() + 543)
if (execution.getVariable("since_date")) {
    execution.setVariable("Since_date", days)
} else {
    execution.setVariable("Since_date", "")
}
// var dd = {
//     "id" : null,
//     "name" : execution.getVariable("type_product")
// } 
// execution.setVariable("type_product",JSON.stringify(dd))

var roles = execution.getVariable("roles")
roles = JSON.parse(roles)

for (var i = 0; i < roles.length; i++) {
    var value = roles[i]
    switch (type_product) {
        case value.Product: {
            if (profit >= value.Sup) {
                execution.setVariable("flow", "1")
            } else if (profit >= value.Dm && profit < value.Sup) {
                execution.setVariable("flow", "2")
            } else if (profit >= value.Vp && profit < value.Dm) {
                execution.setVariable("flow", "3")
            } else {
                execution.setVariable("flow", "4")
            }
        } break
    }
}

if (execution.getVariable("until_change") == true) {
    execution.setVariable("effective_to", "จนกว่าจะมีการเปลี่ยนแปลง")
}
else {
    var dd = new Date(execution.getVariable("effective_tdate"))
    var MM = dd.getDate() + "/" + (dd.getMonth() + 1) + "/" + dd.getFullYear()
    var days = dd.getDate() + " " + workflowUtils.getThaiMonth(MM) + " " + (dd.getFullYear() + 543)
    execution.setVariable("effective_to", days)
}
var managerId = workflowUtils.getManagerByUserId(execution.getVariable("initiator"));
execution.setVariable("managerId", managerId)

var dd = new Date(execution.getVariable("pttor_effective_fdate"))
var MM = dd.getDate() + "/" + (dd.getMonth() + 1) + "/" + dd.getFullYear()
var days = dd.getDate() + " " + workflowUtils.getThaiMonth(MM) + " " + (dd.getFullYear() + 543)
if (execution.getVariable("pttor_effective_fdate")) {
    execution.setVariable("pttor_effective_from", days)
} else {
    execution.setVariable("pttor_effective_from", "")
}



var dd = new Date(execution.getVariable("pttor_effective_date"))
var MM = dd.getDate() + "/" + (dd.getMonth() + 1) + "/" + dd.getFullYear()
var days = dd.getDate() + " " + workflowUtils.getThaiMonth(MM) + " " + (dd.getFullYear() + 543)
if (execution.getVariable("pttor_effective_date")) {
    execution.setVariable("p_date", days)
} else {
    execution.setVariable("p_date", "")
}

