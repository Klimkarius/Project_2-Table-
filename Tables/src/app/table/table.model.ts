export class ZipCodeObject {
    constructor(
      public zipCodeId: string | null = null,
      public zipCode: number | null = null,
      public countryId: string | null = null,
      public cityName: string | null = null,
      public additionalDigit: number | null = null,
      public country: string | null = null,
      public city: string | null = null,
  
    ){}
}

export class DataTableObject<T> {
    constructor(
      public data: T,
      public pageNumber: number = 0,
      public pageSize: number = 0,
      public totalPages: number = 0,
      public totalRecords: number = 0,
    ){}
  }

export class ApplicatorObject {
    constructor(
        public memberId: string | null = null,
        public email: string | null = null,
        public firstName: string | null = null,
        public lastName: string | null = null,
        public gender: string | null = null,
        public jobTitle: string | null = null,
        public memberCode: string | null = null,
        public employeeTypeId: string | null = null,
        public employeeType: string | null = null,
        public phoneNumber: string | null = null,
        public memberGuid: string | null = null,
        public isActive: Boolean | null = null,
        public middleName: string | null = null,
        public memberZipCodes: Array<ZipCodeObject> = new Array<ZipCodeObject>()
    ){
    }
  }

  export class DataTableFilter {
    constructor(
      public pageNumber: number = 1,
      public pageSize: number = 10,
      public sortDirection: string | null = null,
      public sortColumn: string | null = null,
      public search: string | null = null,
      public countryId: number |null = null,
    ) {}
  }

  export class APIResult<T>{
    constructor(
      public message: string | null = null,
      public statusCode: number = 0,
      public response: T
    ){}
  }