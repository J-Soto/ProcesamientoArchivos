Sub Transformar()
    ScreenUpdating = False
	Sheets("BaseDatos_egresos").Select
    Range("A3").Select
    Range(Selection, Selection.End(xlToRight)).Select
    Range(Selection, Selection.End(xlDown)).Select
    Selection.ClearContents
    Rows("2:2").Select
    Selection.Insert Shift:=xlDown, CopyOrigin:=xlFormatFromLeftOrAbove
    Rows("1:1").Select
    Selection.End(xlToLeft).Select
    Range(Selection, Selection.End(xlToRight)).Select
    Selection.AutoFilter
    ActiveCell.FormulaR1C1 = "Mostrar Detalles Ppto"
    Range("A2").Select
    Range(Selection, Selection.End(xlToRight)).Select
    Selection.AutoFilter
    Range("J3").Select
    Selection.End(xlToLeft).Select
    Sheets("Reporte Centuria").Select
    Set rng = Range(Range("A1"), Range("A1").SpecialCells(xlLastCell))
    ActiveSheet.ListObjects.Add(xlSrcRange, rng, , xlYes).Name = _
        "ReporteCenturia"
    Range("ReporteCenturia").Select
    Selection.Copy
    Application.CutCopyMode = False
    Selection.Copy
	Sheets("BaseDatos_egresos").Select
    Range("A3").Select
    Selection.PasteSpecial Paste:=xlPasteValues, Operation:=xlNone, SkipBlanks _
        :=False, Transpose:=False
    Range("A3").Select
    Rows("1:1").Select
    Application.CutCopyMode = False
    Selection.Copy
    Rows("3:3").Select
    Selection.PasteSpecial Paste:=xlPasteFormulas, Operation:=xlNone, _
        SkipBlanks:=True, Transpose:=False
    Range("Q3:AG3").Select
    Application.CutCopyMode = False
    Selection.AutoFill Destination:=Range("Q3:AG2544")
    Range("Q3:AG2544").Select
    Range("U3").Select
    ActiveCell.FormulaR1C1 = "=VALUE(MID(RC[-17],1,1))"
    Range("U3").Select
    Selection.AutoFill Destination:=Range("U3:U2544")
    Range("U3:U2544").Select
    Range("V3").Select
    ActiveCell.FormulaR1C1 = "=VALUE(MID(RC[-18],1,2))"
    Range("V3").Select
    Selection.AutoFill Destination:=Range("V3:V2544")
    Range("V3:V2544").Select
    Range("AF1").Select
	Sheets("Td_Detalle").Select
    ScreenUpdating = True
    End Sub	
------
Sub Actualizar()
    Dim wsTD As Worksheet:
    Set wsTD = Worksheets("Td_Detalle")
    Set PivotRange = Sheets("BaseDatos_egresos").Range("A3").CurrentRegion.Offset(1, 0)
    Sheets("Td_Detalle").PivotTables("TablaDinámica1").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    Sheets("Td_Detalle").PivotTables("TablaDinámica2").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    Sheets("Td_Detalle").PivotTables("TablaDinámica3").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    Sheets("Td_Detalle").PivotTables("TablaDinámica4").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    lastRow0 = Sheets("Td_Detalle").Cells.Find(what:="Presupuesto 2022 - (DETALLE GENERAL DE TODAS LAS PARTIDAS)").End(xlUp).Offset(1, 0).Row
    Dim b As Integer: b = lastRow0
    Dim i As Integer: i = 0
    While i < 20
        Rows(b).Insert
        b = b + 1
        i = i + 1
    Wend
    Sheets("Td_Detalle").PivotTables("TablaDinámica6").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    Sheets("Td_Detalle").PivotTables("TablaDinámica5").ChangePivotCache _
            ThisWorkbook.PivotCaches.Create(SourceType:=xlDatabase, SourceData:=PivotRange)
    With ActiveSheet
            lastrow = .Cells(.Rows.Count, "A").End(xlUp).Offset(1, 0).Row
    End With
    Range("A" & lastrow).Activate
    Range("A" & lastrow) = lastrow
    Dim c As Integer: c = lastrow
    Dim j As Integer: j = 0
    While j < 20
        Rows(c).Insert
        c = c + 1
        j = j + 1
    Wend
    End Sub

------
