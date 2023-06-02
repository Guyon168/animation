!function () {
    //封装方法，压缩之后减少文件大小
    function get_attribute(node, attr, default_value) {
        return node.getAttribute(attr) || default_value;
    }

    //封装方法，压缩之后减少文件大小
    function get_by_tagname(name) {
        return document.getElementsByTagName(name);
    }

    //获取配置参数
    function get_config_option() {
        var scripts = get_by_tagname("script"),
            script_len = scripts.length,
            script = scripts[script_len - 1]; //当前加载的script

        return {
            l: script_len, //长度，用于生成id用
            z: get_attribute(script, "zIndex", -1), //z-index，-表示堆叠层数在最下面，即放在最下面的图层
            o: get_attribute(script, "opacity", 0.5), //opacity，透明度
            c: get_attribute(script, "color", "255,255,255"), //color，线条颜色
            n: get_attribute(script, "count", 99), //count，画布线条数量
            min_size: get_attribute(script, "minSize", 5), //min_size，最小尺寸
            max_opacity: get_attribute(script, "maxOpacity", 0.9), //max_opacity，最大透明度
            min_opacity: get_attribute(script, "minOpacity", 0.1),//min_opacity，最小透明度

        };
    }

    //设置canvas的高宽
    function set_canvas_size() {
        canvas_width = the_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            canvas_height = the_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }

    //绘制过程
    function draw_canvas() {
        context.clearRect(0, 0, canvas_width, canvas_height);
        //随机的线条和当前位置联合数组
        var all_array = [current_point].concat(random_lines);
       // var e, i, d, x_dist, y_dist, dist; //临时节点
        var e, i, x_dist, y_dist, dist; //临时节点
        //遍历处理每一个点
        random_lines.forEach(function (r) {
         //  r.x += r.xa,
           //     r.y += r.ya, //移动

               // r.xa *= r.x > canvas_width || r.x < 0 ? -1 : -1,//最后一个1表示碰到边界，反向反弹，改成-1会使其y轴运动
               // r.ya *= r.y > canvas_height || r.y < 0 ? 1 : 1, //碰到边界，反向反弹

             //   r.xa *= r.x > canvas_width || r.x < 0 ? -1 : 1, //x轴边界判断
                // 判断点的y坐标，如果超出画布高度，就设置为0，否则不改变
            //    r.y = r.y > canvas_height ? 0 : r.y;

            r.y -= r.ya; // 从下往上移动
            if (r.y < 0) {
                r.y = canvas_height; // 重新生成在屏幕底部
            }



            context.beginPath();
               // context.arc(r.x, r.y, 5, 0, 2 * Math.PI); // 绘制一个半径为1.5的圆，数值可以改
                 context.arc(r.x, r.y, r.size, 0, 2 * Math.PI); // 使用点的大小
                context.fillStyle = "rgba(255, 255, 255, " + r.opacity + ")"; // 使用点的透明度
                context.shadowBlur = r.size * 1; // 添加阴影效果
                context.shadowColor = "rgba(255, 255, 255, " + r.opacity + ")";




            //   context.fillStyle = "rgba(255, 255, 255, 0.9)"; // 设置圆点的颜色和透明度



                context.fill(); // 填充圆点
            for (i = 0; i < all_array.length; i++) {
                e = all_array[i];
                //绘制两个点之间的连线的功能。代码中的 r 和 e 分别表示当前点和上一个点。x_dist 和 y_dist 分别表示两个点之间在 X 轴和 Y 轴上的距离，dist 是两点之间的总距离。如果距离小于当前点的 max 属性，则开始绘制连线
                if (r !== e && null !== e.x && null !== e.y) {
                    x_dist = r.x - e.x, //x轴距离 l
                        y_dist = r.y - e.y, //y轴距离 n
                        dist = x_dist * x_dist + y_dist * y_dist; //总距离, m
                    dist < e.max && (e === current_point && dist >= e.max /2 && (r.x -= 0.03 * x_dist, r.y -= 0.03 * y_dist)//靠近的时候加速,current_point表示当前鼠标位置
                  //      d = (e.max - dist) / e.max,
                    //    context.beginPath()
                    //    context.lineWidth = d / 2,//线条粗细



                    //    context.strokeStyle = "rgba(" + config.c + "," + (d + 0.2) + ")",//这里调整线条的颜色和透明度，d+0.5为透明度，config.c控制颜色




                    //    context.moveTo(r.x, r.y),
                     //   context.lineTo(e.x, e.y),
                      //  context.stroke()
                    )

                }
            }

            all_array.splice(all_array.indexOf(r), 1);

        }), frame_func(draw_canvas);
    }

    //创建画布，并添加到body中
    var the_canvas = document.createElement("canvas"), //画布
        config = get_config_option(), //配置
        canvas_id = "c_n" + config.l, //canvas id
        context = the_canvas.getContext("2d"), canvas_width, canvas_height,
        frame_func = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (func) {
            window.setTimeout(func, 1000 / 45);
        }, random = Math.random,
        current_point = {
            x: null, //当前鼠标x
            y: null, //当前鼠标y
            max: 5000
        };
    the_canvas.id = canvas_id;
    the_canvas.style.cssText = "position:fixed;top:0;left:0;z-index:" + config.z + ";opacity:" + config.o;
    get_by_tagname("body")[0].appendChild(the_canvas);
    //初始化画布大小

    set_canvas_size(), window.onresize = set_canvas_size;
    //当时鼠标位置存储，离开的时候，释放当前位置信息
    window.onmousemove = function (e) {
        e = e || window.event, current_point.x = e.clientX, current_point.y = e.clientY;
    }, window.onmouseout = function () {
        current_point.x = null, current_point.y = null;
    };

    // 设置最大和最小大小、透明度
    var max_size = 3;      // 最大大小设为5
    var min_size = 2;       // 最小大小设为1
    var max_opacity = 1.5;  // 最大透明度设为1
    var min_opacity = 0.1;  // 最小透明度设为0.1

    //随机生成config.n条线位置信息
    for (var random_lines = [], i = 0; config.n > i; i++) {
        var x = random() * canvas_width, //随机位置
            y = random() * canvas_height,
            xa =  random() - 0.5, //线条x方向随机运动方向
            ya = random()  * 0.4, //线条y方向运动方向，ya值大小影响速度，正负影响运动方向
           // ya = random() - 0.5, //线条y方向运动方向，2 * random() - 1为随机，random() 表示总是向下
            size = Math.random() * (max_size - min_size) + min_size, //设置最大和最小大小的范围
            //  size = Math.random() * (config.max_size - config.min_size) + parseFloat(config.min_size), //设置最大和最小大小的范围
           //   opacity = Math.random() * (config.max_opacity - config.min_opacity) + parseFloat(config.min_opacity); //设置最大和最小透明度的范围
            opacity = Math.random() * (max_opacity - min_opacity) + min_opacity; //设置最大和最小透明度的范围
        random_lines.push({
            x: x,
            y: y,
            xa: xa,
            ya: ya,
            size: size, // 新增：大小
            opacity: opacity, // 新增：透明度
            max: 5000, //点与点之间的沾附距离

        });
    }
    //0.1秒后绘制
    setTimeout(function () {
        draw_canvas();
    }, 100);

}();