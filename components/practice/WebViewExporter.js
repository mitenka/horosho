import React, { useRef } from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

const WebViewExporter = ({
  diaryData,
  controlAssessment,
  onExportComplete,
}) => {
  const webViewRef = useRef(null);

  // Generate used skills section for export
  const generateUsedSkillsSection = (data) => {
    const skillCategories = {
      mindfulness: { title: "Осознанность", color: "#4CAF50" },
      interpersonal: { title: "Межличностная эффективность", color: "#2196F3" },
      emotionRegulation: { title: "Регуляция эмоций", color: "#FF9800" },
      stressTolerance: { title: "Переживание стресса", color: "#FF5722" }
    };

    // Collect all used skills by date and category
    const skillsByDate = {};
    Object.entries(data || {}).forEach(([date, entry]) => {
      if (entry.usedSkills && entry.usedSkills.length > 0) {
        skillsByDate[date] = entry.usedSkills;
      }
    });

    if (Object.keys(skillsByDate).length === 0) {
      return "";
    }

    return `
      <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e1e5e9;">
        <h2 style="color: #2d2d4a; font-size: 20px; margin-bottom: 16px;">Использованные навыки</h2>
        ${Object.entries(skillsByDate).map(([date, skills]) => `
          <div style="margin-bottom: 20px; padding: 16px; background: #f8f9fa; border-radius: 12px;">
            <h3 style="margin: 0 0 12px 0; color: #2d2d4a; font-size: 16px; font-weight: 600;">${date}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${skills.map(skill => {
                // Parse markdown-style bold text for display
                const cleanSkill = skill.replace(/\*\*(.*?)\*\*/g, '$1');
                return `<span style="padding: 6px 12px; background: white; border-radius: 8px; font-size: 14px; color: #495057; border-left: 3px solid #667eea;">${cleanSkill}</span>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const generateHTML = (data, assessment) => {
    // Convert diary data to table rows
    const tableRows = Object.entries(data || {})
      .map(([date, entry]) => {
        const behaviors = entry.behaviors || [];
        if (behaviors.length === 0) return "";

        return behaviors
          .map(
            (behavior) => `
          <tr>
            <td>${date}</td>
            <td>${behavior.name}</td>
            <td>${behavior.type === "boolean" ? "Да/Нет" : "Шкала"}</td>
            <td>${behavior.desire !== undefined ? behavior.desire : "-"}</td>
            <td>${
              behavior.action !== undefined
                ? behavior.type === "boolean"
                  ? behavior.action
                    ? "✓"
                    : "✗"
                  : behavior.action
                : "-"
            }</td>
          </tr>
        `
          )
          .join("");
      })
      .filter((row) => row)
      .join("");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 16px;
              padding: 24px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #2d2d4a;
              text-align: center;
              margin-bottom: 24px;
              font-size: 24px;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 16px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #e1e5e9;
            }
            th {
              background-color: #f8f9fa;
              font-weight: 600;
              color: #2d2d4a;
              font-size: 14px;
            }
            td {
              font-size: 13px;
              color: #495057;
            }
            tr:hover {
              background-color: #f8f9fa;
            }
            .empty-state {
              text-align: center;
              color: #6c757d;
              font-style: italic;
              padding: 40px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Дневник поведения</h1>
            ${
              tableRows
                ? `
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Поведение</th>
                    <th>Тип</th>
                    <th>Желание</th>
                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  ${tableRows}
                </tbody>
              </table>
            `
                : `
              <div class="empty-state">
                Нет данных для отображения
              </div>
            `
            }
            
            ${
              assessment
                ? `
              <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e1e5e9;">
                <h2 style="color: #2d2d4a; font-size: 20px; margin-bottom: 16px;">Как вы оцениваете влияние на свои мысли, эмоции и поведение?</h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-top: 16px;">
                  <div style="text-align: center; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="margin: 0 0 8px 0; color: #2d2d4a; font-size: 16px;">Мысли</h3>
                    <div style="font-size: 24px; font-weight: 600; color: #667eea;">${
                      assessment.thoughts !== null ? assessment.thoughts : "-"
                    }</div>
                  </div>
                  <div style="text-align: center; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="margin: 0 0 8px 0; color: #2d2d4a; font-size: 16px;">Эмоции</h3>
                    <div style="font-size: 24px; font-weight: 600; color: #667eea;">${
                      assessment.emotions !== null ? assessment.emotions : "-"
                    }</div>
                  </div>
                  <div style="text-align: center; padding: 16px; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="margin: 0 0 8px 0; color: #2d2d4a; font-size: 16px;">Поведение</h3>
                    <div style="font-size: 24px; font-weight: 600; color: #667eea;">${
                      assessment.actions !== null ? assessment.actions : "-"
                    }</div>
                  </div>
                </div>
              </div>
            `
                : ""
            }
            
            ${generateUsedSkillsSection(data)}
          </div>
          
          <canvas id="exportCanvas" width="800" height="600" style="display: none;"></canvas>
          
          <script>
            function generateImage() {
              const canvas = document.getElementById('exportCanvas');
              const ctx = canvas.getContext('2d');
              
              // Set canvas size
              canvas.width = 800;
              canvas.height = 600;
              
              // Fill background with gradient
              const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
              gradient.addColorStop(0, '#667eea');
              gradient.addColorStop(1, '#764ba2');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              // Draw white container
              ctx.fillStyle = 'white';
              ctx.roundRect(40, 40, canvas.width - 80, canvas.height - 80, 16);
              ctx.fill();
              
              // Draw title
              ctx.fillStyle = '#2d2d4a';
              ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('Дневник поведения', canvas.width / 2, 100);
              
              // Draw table data
              const tableData = ${JSON.stringify(
                Object.entries(data || {}).flatMap(([date, entry]) =>
                  (entry.behaviors || []).map((behavior) => [
                    date,
                    behavior.name,
                    behavior.type === "boolean" ? "Да/Нет" : "Шкала",
                    behavior.desire !== undefined
                      ? behavior.desire.toString()
                      : "-",
                    behavior.action !== undefined
                      ? behavior.type === "boolean"
                        ? behavior.action
                          ? "✓"
                          : "✗"
                        : behavior.action.toString()
                      : "-",
                  ])
                )
              )};
              
              if (tableData.length > 0) {
                // Draw table headers
                ctx.fillStyle = '#f8f9fa';
                ctx.fillRect(60, 130, canvas.width - 120, 40);
                
                ctx.fillStyle = '#2d2d4a';
                ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'left';
                
                const headers = ['Дата', 'Поведение', 'Тип', 'Желание', 'Действие'];
                const colWidths = [120, 200, 100, 80, 80];
                let x = 80;
                
                headers.forEach((header, i) => {
                  ctx.fillText(header, x, 155);
                  x += colWidths[i];
                });
                
                // Draw table rows
                ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.fillStyle = '#495057';
                
                tableData.slice(0, 15).forEach((row, rowIndex) => {
                  const y = 190 + rowIndex * 30;
                  let x = 80;
                  
                  row.forEach((cell, colIndex) => {
                    ctx.fillText(cell.toString().substring(0, 20), x, y);
                    x += colWidths[colIndex];
                  });
                });
                
                if (tableData.length > 15) {
                  ctx.fillStyle = '#6c757d';
                  ctx.font = 'italic 12px -apple-system, BlinkMacSystemFont, sans-serif';
                  ctx.textAlign = 'center';
                  ctx.fillText(\`... и ещё \${tableData.length - 15} записей\`, canvas.width / 2, 550);
                }
              } else {
                ctx.fillStyle = '#6c757d';
                ctx.font = 'italic 16px -apple-system, BlinkMacSystemFont, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('Нет данных для отображения', canvas.width / 2, canvas.height / 2);
              }
              
              // Convert to base64 and send back
              const imageData = canvas.toDataURL('image/png');
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'export_complete',
                data: imageData
              }));
            }
            
            // Add roundRect polyfill for older browsers
            if (!CanvasRenderingContext2D.prototype.roundRect) {
              CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
                this.beginPath();
                this.moveTo(x + radius, y);
                this.lineTo(x + width - radius, y);
                this.quadraticCurveTo(x + width, y, x + width, y + radius);
                this.lineTo(x + width, y + height - radius);
                this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
                this.lineTo(x + radius, y + height);
                this.quadraticCurveTo(x, y + height, x, y + height - radius);
                this.lineTo(x, y + radius);
                this.quadraticCurveTo(x, y, x + radius, y);
                this.closePath();
              };
            }
            
            // Generate image when page loads
            setTimeout(generateImage, 100);
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "export_complete") {
        onExportComplete(message.data);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View style={{ width: 1, height: 1, opacity: 0 }}>
      <WebView
        ref={webViewRef}
        source={{ html: generateHTML(diaryData, controlAssessment) }}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={false}
        style={{ width: 1, height: 1 }}
      />
    </View>
  );
};

export default WebViewExporter;
