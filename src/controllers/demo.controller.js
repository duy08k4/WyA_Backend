class DemoController {
    // [GET]: /demo
    showContent (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'GET':
                res.send("The MVC model is working. You're in endpoint /demo")
                break;
        
            default:
                res.send("Your method is not supportted")
                break
        }
    }

    // [GET]: /demo/more
    showContentMore (req, res) {
        let requestMethod = req.method

        switch (requestMethod) {
            case 'GET':
                res.send("The MVC model is working. You're in endpoint /demo/more")
                break;
        
            default:
                res.send("Your method is not supportted")
                break
        }
    }
}

module.exports = new DemoController