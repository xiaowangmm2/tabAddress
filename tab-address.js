define(
["hiklylib", "hiklyui"],
function(require, exports, module) {
	/**
	 * [tabAddress description]tab时间组件
	 * @author wanghaiyan
	 * @date   2015-11-03
	 * @param  {[type]}   parentId     [description]父元素的id
	 * @param  {[type]}   cityData     [description]数据
	 * @param  {String}   selectedData [description]选中的数据
	 * @param  {Boolean}  isAll        [description]是否要显示全部,true:显示全部，需要显示门店，false则相反
	 * @return {[type]}                [description]
	 */
	var tabAddress = function(parentId, cityData, selectedData, isAll){
		this.parentId = parentId;
		this.prov = $(parentId).find('.js-province-module');
        this.city = $(parentId).find('.js-city-module');
        this.area = $(parentId).find('.js-area-module');
        this.shop = $(parentId).find('.js-shop-module');
        this.cityData = cityData;	
        this.selectedData = selectedData;
        this.isAll = isAll;
	}
	/**
	 * [init description]初始化
	 * @author wanghaiyan
	 * @date   2015-11-03
	 * @return {[type]}        [description]
	 */
    tabAddress.prototype.init = function() {
        /*初始化省市区切换事件*/
        this.initEvent();
        /*初始化生成省*/
        this.initAddress();
    }
	/**
	 * [addItem description]
	 * @author wanghaiyan
	 * @date   2015-11-03
	 * @param  {Number}   name  [description]判断是省、市、区
	 * @param  {[type]}   key   [description]判断属性
	 * @param  {[type]}   value [description]值
	 */
	tabAddress.prototype.addItem =function(name, key, value,selectedId){
		var $province = this.prov, $city = this.city, $area = this.area, $shop = this.shop,
			cityData = this.cityData, htmlArr = [], $content = "";

        if(name=="province"){
            $content = $province;
        }else if(name=="city"){
            $content = $city;
        }else if(name=="area"){
            $content = $area;
        }else{
            $content = $shop;
        }
        $content.empty();
        //如果有全部显示
        if(this.isAll){
            if(selectedId){
                htmlArr.push('<span data-positionX="" data-positionY="" data-id="-1">全部</span>');
            }else{
                htmlArr.push('<span class="active" data-positionX="" data-positionY="" data-id="-1">全部</span>');
            }
        }
        $.each(cityData,function(i, item) {
            if(item[key] == value){
                if (item["id"]== selectedId) {
                    htmlArr.push('<span class="active" data-positionX="'+ cityData[i].positionX +'" data-positionY="'+ cityData[i].positionY +'" data-id="' + cityData[i].id + '">' + cityData[i].name + '</span>');
                } else {
                    htmlArr.push('<span data-positionX="'+ cityData[i].positionX +'" data-positionY="'+ cityData[i].positionY +'" data-id="' + cityData[i].id + '">' + cityData[i].name + '</span>');
                }
            }
        });
        $content.html(htmlArr.join(''));
        //如果没有全部并且没有被选中的值，默认选中第一个
        if(!this.isAll && !selectedId){
            $content.find("span").eq(0).addClass('active');
        }
	}
    /**
     * [initEvent description]省市区点击事件
     * @author wanghaiyan
     * @date   2015-11-04
     * @return {[type]}   [description]
     */
	tabAddress.prototype.initEvent =function(){
		var This = this;
		var $province = This.prov, $city = This.city, $area = This.area, $shop = This.shop,
			selectedData = This.selectedData,
			selectProv = "",selectCity = "",selectArea = "",selectShop = "";
		if(selectedData){
            selectProv = selectedData.provinceId;
            selectCity = selectedData.cityId;
            selectArea = selectedData.countryId;
            selectShop = selectedData.storeId;
        }
        //点击省
        $province.find("span").live('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
            This.createCity(selectCity, selectArea);
            if(This.isAll){
            	This.createShop(selectShop);
            }
        });
        //点击市
        $city.find("span").live('click', function() {
            $(this).addClass('active').siblings().removeClass('active');
        	This.createArea(selectArea);
            if(This.isAll){
            	This.createShop(selectShop);
        	}
        });
        //点击区
        if(This.isAll){
            $area.find("span").live('click', function() {
                $(this).addClass('active').siblings().removeClass('active');
                This.createShop(selectShop);
            });
        }
	}
    /**
     * [initAddress description]初始化生成省市区逻辑
     * @author wanghaiyan
     * @date   2015-11-04
     * @return {[type]}   [description]
     */
	tabAddress.prototype.initAddress = function(){
		var selectedData = this.selectedData;
		var selectProv = "",selectCity = "",selectArea = "",selectShop = "";
		if(selectedData){
            selectProv = selectedData.provinceId;
            selectCity = selectedData.cityId;
            selectArea = selectedData.countryId;
            selectShop = selectedData.storeId;
        }
        //创建省
        this.createProv(selectProv);
        //创建市
        this.createCity(selectCity,selectArea);
        //如果有门店，则添加门店
        if(this.isAll){
            this.createShop(selectShop);
        }
	}
    /**
     * [createProv description]创建省
     * @author wanghaiyan
     * @date   2015-11-04
     * @param  {String}   selectProv [description]
     * @return {[type]}              [description]
     */
    tabAddress.prototype.createProv = function(selectProv){
        this.addItem('province', 'type', 0,selectProv);
    }
    /**
     * [createCity description]创建市
     * @author wanghaiyan
     * @date   2015-11-04
     * @param  {String}   selectCity [description]
     * @param  {String}   selectArea [description]
     * @return {[type]}              [description]
     */
    tabAddress.prototype.createCity = function(selectCity, selectArea){
        var activeProv = this.prov.find('span.active');
        var provId = activeProv.data("id");
        var provText = activeProv.text();
        var municipality = [
            '北京市',
            '天津市',
            '上海市',
            '重庆市',
            '澳门特别行政区',
            '香港特别行政区'
        ];
        // 直辖市下面没有城市,则不需循环创建市
        if (municipality.join('').indexOf(provText) == -1) {
            //创建市
            this.addItem('city', 'parentId', provId, selectCity);
            //创建区
            this.createArea(selectArea);
        } else {
            //创建市（写死）
            this.city.empty().html('<span data-id="" style="cursor:default;">--</span>');
            //创建区
            this.addItem('area', 'parentId', provId, selectArea);
        }
    }
    /**
     * [createArea description]创建区
     * @author wanghaiyan
     * @date   2015-11-04
     * @param  {String}   selectArea [description]
     * @return {[type]}              [description]
     */
    tabAddress.prototype.createArea = function(selectArea){
        var activeCity = this.city.find('span.active');
        var cityId = activeCity.data("id");
        var cityText = activeCity.text();
        var municipality = [
          '仙桃市','潜江市','天门市','神农架林区','东莞市','中山市',
          '三亚市','五指山市', '琼海市','儋州市','文昌市','万宁市',
          '东方市','定安县','屯昌县','澄迈县','临高县','白沙黎族自治县',
          '昌江黎族自治县','乐东黎族自治县','陵水黎族自治县','保亭黎族苗族自治县',
          '琼中黎族苗族自治县','嘉峪关市','石河子市','阿拉尔市','图木舒克市',
          '五家渠市','台北县','宜兰县','新竹县','桃园县','苗栗县',
          '台中县','彰化县','南投县','嘉义县','云林县','台南县','高雄县',
          '屏东县','台东县','花莲县','澎湖县'
        ];
        // 直辖市下面没有城市,则不需循环创建市
        if (municipality.join('').indexOf(cityText) == -1) {
            this.addItem('area', 'parentId', cityId, selectArea);
        } else {
            this.area.empty().html('<span data-id="" style="cursor:default;">--</span>');
        }
    }
    /**
     * [createShop description]创建门店
     * @author wanghaiyan
     * @date   2015-11-04
     * @param  {String}   selectShop [description]
     * @return {[type]}              [description]
     */
    tabAddress.prototype.createShop = function(selectShop){
        var activeArea = this.area.find('span.active');
        var areaId = activeArea.data("id");
        this.addItem('shop', 'parentId', areaId, selectShop);
    }
	module.exports = tabAddress;
});
