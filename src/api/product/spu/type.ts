//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//SPU数据ts类型
export interface SpuData {
  id?: number
  spuName: string
  tmId: number | string
  description: string
  category3Id: string | number
  spuSaleAttrList: null | SaleAttr[]
  spuImageList: null | SpuImage[]
}

//数组：元素都是已有SPU数据类型
export type Records = SpuData[]
//定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

//品牌数据ts类型
export interface TradeMark {
  id: number
  tmName: string
  logoUrl: string
}
//品牌接口返回数据ts类型
export interface AllTradeMark extends ResponseData {
  data: TradeMark[]
}

//商品图片ts类型
export interface SpuImage {
  id?: number
  createTime?: string
  updateTime?: string
  spuId?: number
  imgName?: string
  imgUrl?: string
  name?: string
  url?: string
}
//已有SPU照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImage[]
}
//已有SPU销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}
//存储已有销售属性值类型
export type spuSaleAttrValueList = SaleAttrValue[]

//销售属性对象ts类型
export interface SaleAttr {
  id: number
  createTime: null
  updateTime: null
  spuId: number
  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: spuSaleAttrValueList
}

//SPU已有销售属性接口返回数据类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

//已有的全部SPU返回数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
