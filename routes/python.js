
express = require('express');
router = express.Router();
spawn = require("child_process").spawn;

router.post('/run_python', function(req, res){

    console.log('begin child process');
    child_process = spawn('python',["./scripts/word2vec.py"]);
    child_process.stdout.on('data', function (data){
        standardized_output = `LOG OUTPUT: ${(new Date()).toString()}\n${data.toString()}`;
        fs.appendFile('public/python.log', standardized_output, function (err) {
            if (err) throw err;
        });
        // Do something with the data returned from python script
    });
    child_process.stderr.on('data', function(data){
        standardized_err = `LOG ERROR: ${(new Date()).toString()}\n${data.toString()}`;
        fs.appendFile('public/python_err.log', standardized_err, function (err) {
            if (err) throw err;
        });
    });
    res.send(`new child process started on pid: ${child_process.pid}`);

});

router.get('/python_log', function(req, res){
    fs.readFile('public/python.log', function(err, data){
        if(err) throw err;
        res.send(data.toString());
    })
});

router.post('/is_script_running', function(req, res){
    pid = req.body.pid
    if(!pid) res.status(400).send('need a pid');
    data = require('is-running')(pid);
    res.send(data);
});

module.exports = router;