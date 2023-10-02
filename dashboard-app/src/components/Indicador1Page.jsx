import React, { useState, useMemo, useRef, useEffect } from "react";
import { EXCEL_FILE_BASE64 } from "../constants";
import { saveAs } from "file-saver";
import FileSaver from "file-saver";
import { Link, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Dropzone from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Pie, Doughnut } from "react-chartjs-2";
import { useTable } from "react-table";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid"; // Importa DataGrid
import plantilla from "../plantillas/nuevo.xlsx";
import base64 from "base-64";
import { Chart } from "chart.js/auto";
import PieChart from "./PieChart";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);
const validationSchema = Yup.object().shape({
  UUID: Yup.string().required("El campo UUID es requerido"),
  "DOC TYPE": Yup.string()
    .required("El campo DOC TYPE es requerido")
    .oneOf(
      ["DNI", "PASSPORT"],
      'El campo DOC TYPE debe ser "DNI" o "PASSPORT"'
    ),
  "DOC NUMBER": Yup.number()
    .required("El campo DOC NUMBER es requerido")
    .typeError("El campo DOC NUMBER debe ser un número"),
  "FULL NAME": Yup.string()
    .required("El campo FULL NAME es requerido")
    .matches(/^[^\s][\s\S]*$/, "El campo FULL NAME debe ser un nombre válido"),
});

const Indicador1Page = () => {
  const { indicador } = useParams();
  const [tableColumns, setTableColumns] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [validationResults, setValidationResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [file, setFile] = useState(null);
  const [invalidRecords, setInvalidRecords] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [shouldRenderChart, setShouldRenderChart] = useState(false);
  const [showDropzone, setShowDropzone] = useState(true);
  const chartRef = useRef(null);
  const [total, setTotal] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [validCount, setValidCount] = useState(0);

  const formik = useFormik({
    initialValues: {
      campo1: "",
      campo2: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form submitted with values:", values);
    },
  });

  const uniqueDocNumbers = new Set();
  const uniqueFullNames = new Set();

  const processExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      const excelColumns = Object.keys(jsonData[0]);
      setTableColumns(
        excelColumns
          .map((column) => ({
            field: column, // Cambia 'Header' a 'field'
            headerName: column, // Define el nombre de la columna
            width: 180, // Define el ancho de la columna (ajústalo según tus necesidades)
          }))
          .concat([
            {
              field: "Invalido",
              headerName: "Invalido",
              width: 120,
            },
            {
              field: "Razón de Invalidez",
              headerName: "Razón de Invalidez",
              width: 200,
            },
          ])
      );

      const validRecords = [];
      const invalidRecords = [];
      var results = {
        valid: [],
        invalid: [],
        statistics: {
          total: 0,
          validCount: 0,
          invalidCount: 0,
        },
      };
      jsonData.forEach((record, index) => {
        try {
          validationSchema.validateSync(record, { abortEarly: false });

          if (
            uniqueDocNumbers.has(record["DOC NUMBER"]) ||
            uniqueFullNames.has(record["FULL NAME"])
          ) {
            invalidRecords.push({
              ...record,
              Invalido: "Sí",
              "Razón de Invalidez": "Registro duplicado",
            });
          } else {
            uniqueDocNumbers.add(record["DOC NUMBER"]);
            uniqueFullNames.add(record["FULL NAME"]);
            validRecords.push({
              ...record,
              Invalido: "No",
              "Razón de Invalidez": "",
            });
          }
        } catch (errors) {
          const invalidRecord = {
            ...record,
            Invalido: "Sí",
            "Razón de Invalidez": errors.errors.join(", "),
          };
          invalidRecords.push(invalidRecord);
        }
      });

      const tableDataWithId = invalidRecords.map((record, index) => ({
        id: index,
        ...record,
      }));

      setTableData(tableDataWithId);

      const totalRecords = jsonData.length;
      const validCount = validRecords.length;
      const invalidCount = invalidRecords.length;
      setTotal(totalRecords);
      setValidCount(validCount);
      setInvalidCount(invalidCount);
      const aux = {
        labels: ["Válidos", "Inválidos"],
        datasets: [
          {
            label: "# registros",
            data: [validCount, invalidCount],
            backgroundColor: ["#36A2EB", "#FF6384"],
            borderWidth: 1,
          },
        ],
      };
      results.valid = validRecords;
      results.invalid = invalidRecords;
      results.statistics.validCount = validCount;
      results.statistics.invalidCount = invalidCount;
      results.statistics.total = totalRecords;
      setValidationResults(results);
      // Actualiza los estados
      setInvalidRecords(invalidRecords);
      setStatistics(aux);
      // Coloca la línea aquí para indicar que el gráfico debe ser renderizado
      setShouldRenderChart(true);
      // Oculta el Dropzone después de procesar el archivo
      setShowDropzone(false);
      // Mostrar la tabla de registros inválidos
      setShowTable(true);
      console.log(aux);
      // Establece los datos del gráfico en el estado
      setChartData(aux);
      // Luego, puedes limpiar el formulario después de procesar el archivo
      formik.resetForm();
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      processExcelFile(selectedFile);
    }
  };

  const handleReloadFile = () => {
    // Verificar si el chartRef y el chartInstance existen antes de destruir el gráfico
    if (chartRef.current && chartRef.current.chartInstance) {
      const chart = chartRef.current.chartInstance;
      chart.destroy();
    }
    setValidationResults(null);
    setShowDropzone(true);
    setShowTable(false);
    setFile(null);
    setInvalidRecords(null);
    setStatistics(null);
    setShouldRenderChart(false);
  };
  const handleFileDownload = () => {
    // Reemplaza la ruta con la ubicación de tu archivo de plantilla en tu sistema local
    const templateFilePath = "C:\\Users\\John\\Desktop\\nuevo.xlsx";

    // Lee el archivo de plantilla
    fetch(templateFilePath)
      .then((response) => response.blob())
      .then((blob) => {
        // Utiliza la librería file-saver para guardar el archivo con el nombre 'Plantilla.xlsx'
        saveAs(blob, "Plantilla.xlsx");
      })
      .catch((error) => {
        console.error("Error al descargar la plantilla:", error);
      });
  };

  const handleDownloadTemplate = async () => {
    const file = await fetch("/plantilla.xlsx").then((res) =>
      res.arrayBuffer()
    );

    const excelFile = await getBuffer();
    const blob = new Blob([excelFile], {
      type: "application/vnd.ms-excel",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "plantilla.xlsx";

    link.click();

    URL.revokeObjectURL(url);
  };
  const excelToBase64 = async () => {
    const buffer = await getBuffer();
    const encodedData = base64.encode(buffer);
    console.log(encodedData);
    return encodedData;
  };
  const getExcelFile = async () => {
    const response = await fetch("/plantillas/nuevo.xlsx");
    const blob = await response.blob();

    const excelFile = new File([blob], "nuevo.xlsx");

    return excelFile;
  };
  const getBuffer = async () => {
    const excelFile = await getExcelFile();
    console.log(excelFile);
    return excelFile.arrayBuffer();
  };
  const handleDownload = async () => {
    excelToBase64().then((base64) => {
      let sliceSize = 1024;
      let byteCharacters = window.atob(EXCEL_FILE_BASE64);
      let bytesLength = byteCharacters.length;
      let slicesCount = Math.ceil(bytesLength / sliceSize);
      let byteArrays = new Array(slicesCount);
      for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        let begin = sliceIndex * sliceSize;
        let end = Math.min(begin + sliceSize, bytesLength);
        let bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      let blob = new Blob(byteArrays, { type: "application/vnd.ms-excel" });
      FileSaver.saveAs(new Blob([blob], {}), "plantilla.xlsx");
    });
  };

  const data2 = {
    labels: statistics ? statistics.labels : ["Válidos", "Inválidos"],
    datasets: [
      {
        label: "# registros",
        data: statistics ? statistics.datasets[0].data : [0, 0],
        backgroundColor: statistics
          ? statistics.datasets[0].backgroundColor
          : ["#36A2EB", "#FF6384"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Container>
      <h2>Indicador {indicador}</h2>
      
      <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>

      <Button component={Link} to="/" variant="outlined" color="primary">
        Volver a la Página de Inicio
      </Button>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleDownload}
        style={{ marginLeft: "10px" }}
      >
        Descargar Plantilla
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          // Handle file upload logic here
        }}
      >
        Enviar Archivo
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleReloadFile}>
        Volver a Cargar un Archivo
      </Button>
      
      </div>
      {showDropzone && (
        <Dropzone onDrop={handleFileUpload}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              style={{
                border: "2px dashed #e0e0e0",
                padding: "20px",
                marginTop: "20px",
              }}
            >
              <input {...getInputProps()} />
              <p>
                Arrastra y suelta un archivo Excel aquí o haz clic para
                seleccionarlo.
              </p>
            </div>
          )}
        </Dropzone>
      )}
      {validationResults && (
        <div style={{ marginTop: "20px" }}>
        <h3>Estadísticas de Registros Inválidos</h3>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
            <div
              style={{ width: "200px", height: "200px", marginRight: "20px" }}
            >
              <Doughnut data={data2} />
            </div>
            <div
              style={{ width: "200px", height: "200px", marginRight: "20px" }}
            >
              <Doughnut data={data2} />
            </div>
            <div
              style={{ width: "200px", height: "200px", marginRight: "20px" }}
            >
              <Doughnut data={data2} />
            </div>
            <div
              style={{ width: "200px", height: "200px", marginRight: "20px" }}
            >
              <Doughnut data={data2} />
            </div>
            <div
              style={{ width: "200px", height: "200px", marginRight: "20px" }}
            >
              <Doughnut data={data2} />
            </div>
          </div>
          
          <div style={{ display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
          <p>Total de registros: {validationResults.statistics.total}</p>
          <p>Registros válidos: {validationResults.statistics.validCount}</p>
          <p>
            Registros inválidos: {validationResults.statistics.invalidCount}
          </p>
          </div>
        </div>
      )}
      {showTable && (
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={tableData}
            columns={tableColumns}
            pageSize={5}
            getRowId={(row) => row.UUID}
          />
        </div>
      )}
      {console.log(invalidRecords)}
    </Container>
  );
};

export default Indicador1Page;
