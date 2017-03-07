const watch = (src) => {
    let fs = require('fs');
    let task = fs.watch(src, () => {
        if (!src || src === '') {
            return;
        }

        location.reload();
        task.close();
    });
}
