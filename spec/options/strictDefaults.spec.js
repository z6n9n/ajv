"use strict"

var Ajv = require("../ajv")
var should = require("../chai").should()

describe("strict option with defaults (replaced strictDefaults)", () => {
  describe("useDefaults = true", () => {
    describe("strict = false", () => {
      it("should NOT throw an error or log a warning given an ignored default", () => {
        var output = {}
        var ajv = new Ajv({
          useDefaults: true,
          strict: false,
          logger: getLogger(output),
        })
        var schema = {
          default: 5,
          properties: {},
        }

        ajv.compile(schema)
        should.not.exist(output.warning)
      })

      it("should NOT throw an error or log a warning given an ignored default #2", () => {
        var output = {}
        var ajv = new Ajv({
          useDefaults: true,
          strict: false,
          logger: getLogger(output),
        })
        var schema = {
          oneOf: [
            {enum: ["foo", "bar"]},
            {
              properties: {
                foo: {
                  default: true,
                },
              },
            },
          ],
        }

        ajv.compile(schema)
        should.not.exist(output.warning)
      })
    })

    describe("strict = true", () => {
      it("should throw an error given an ignored default in the schema root when strict is true or undefined", () => {
        test(new Ajv({useDefaults: true}))
        test(new Ajv({useDefaults: true, strict: true}))

        function test(ajv) {
          const schema = {
            default: 5,
            properties: {},
          }
          should.throw(() => {
            ajv.compile(schema)
          })
        }
      })

      it("should throw an error given an ignored default in oneOf when strict is true or undefined", () => {
        test(new Ajv({useDefaults: true}))
        test(new Ajv({useDefaults: true, strict: true}))

        function test(ajv) {
          var schema = {
            oneOf: [
              {enum: ["foo", "bar"]},
              {
                properties: {
                  foo: {
                    default: true,
                  },
                },
              },
            ],
          }
          should.throw(() => {
            ajv.compile(schema)
          })
        }
      })
    })

    describe('strict = "log"', () => {
      it('should log a warning given an ignored default in the schema root when strict is "log"', () => {
        var output = {}
        var ajv = new Ajv({
          useDefaults: true,
          strict: "log",
          logger: getLogger(output),
        })
        var schema = {
          default: 5,
          properties: {},
        }
        ajv.compile(schema)
        should.equal(output.warning, "default is ignored in the schema root")
      })

      it('should log a warning given an ignored default in oneOf when strict is "log"', () => {
        var output = {}
        var ajv = new Ajv({
          useDefaults: true,
          strict: "log",
          logger: getLogger(output),
        })
        var schema = {
          oneOf: [
            {enum: ["foo", "bar"]},
            {
              properties: {
                foo: {
                  default: true,
                },
              },
            },
          ],
        }
        ajv.compile(schema)
        should.equal(output.warning, "default is ignored for: data.foo")
      })
    })
  })

  describe("useDefaults = false or undefined", () => {
    it("should NOT throw an error given an ignored default in the schema root when useDefaults is false", () => {
      test(new Ajv({useDefaults: false}))
      test(new Ajv({useDefaults: false, strict: true}))
      test(new Ajv())
      test(new Ajv({strict: true}))

      function test(ajv) {
        const schema = {
          default: 5,
          properties: {},
        }
        should.not.throw(() => {
          ajv.compile(schema)
        })
      }
    })

    it("should NOT throw an error given an ignored default in oneOf when useDefaults is false", () => {
      test(new Ajv({useDefaults: false}))
      test(new Ajv({useDefaults: false, strict: true}))
      test(new Ajv())
      test(new Ajv({strict: true}))

      function test(ajv) {
        var schema = {
          oneOf: [
            {enum: ["foo", "bar"]},
            {
              properties: {
                foo: {
                  default: true,
                },
              },
            },
          ],
        }
        should.not.throw(() => {
          ajv.compile(schema)
        })
      }
    })
  })

  function getLogger(output) {
    return {
      log: () => {
        throw new Error("log should not be called")
      },
      warn: function (warning) {
        output.warning = warning
      },
      error: () => {
        throw new Error("error should not be called")
      },
    }
  }
})
