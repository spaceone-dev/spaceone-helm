const { makeBadge, ValidationError } = require('badge-maker')
const yaml = require('yaml')
const svg2png = require('svg2png')
const fs = require('fs')

const yamlData = fs.readFileSync('../Chart.yaml', 'utf-8')
const parsedYaml = yaml.parse(yamlData)

const format = {
  label: 'version',
  message: parsedYaml.version,
  color: 'orange',
}

const svg = makeBadge(format)
if(!fs.existsSync("./media")){
  fs.mkdirSync("./media")
}
fs.writeFileSync("./media/version_info.svg", svg)