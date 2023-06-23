import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import path from "path";

import { GENERATOR_NAME } from "./constants";
import genFastifyRoutes from "./helpers/genFastifyRoutes";
import { writeFileSafely } from "./utils/writeFileSafely";

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      defaultOutput: "../generated",
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    options.dmmf.datamodel.models.forEach(async (info) => {
      const content = await genFastifyRoutes(info);
      const writeLocation = path.join(
        options.generator.output?.value!,
        `routes/${info.name}.ts`
      );

      await writeFileSafely(writeLocation, content);
    });
  },
});
