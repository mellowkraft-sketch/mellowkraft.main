import { comparisonRows } from '../content'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'

function ComparisonScrollSection() {
  return (
    <section id="comparison" className="section comparison-scroll-wrap">
      <div className="comparison-desktop">
        <ContainerScroll
          titleComponent={
            <>
              <h2 className="comparison-title">Shopify vs MellowKraft</h2>
              <p className="comparison-subtitle">
                A direct look at how platform dependence compares to a fully owned commerce architecture.
              </p>
            </>
          }
        >
          <div className="comparison-sheet">
            <div className="comparison-row comparison-head">
              <span>Dimension</span>
              <span>Shopify</span>
              <span>MellowKraft</span>
            </div>
            {comparisonRows.map((row) => (
              <div className="comparison-row" key={row[0]}>
                <span>{row[0]}</span>
                <span>{row[1]}</span>
                <span>{row[2]}</span>
              </div>
            ))}
          </div>
        </ContainerScroll>
      </div>

      <div className="comparison-mobile" aria-label="Shopify vs MellowKraft comparison table">
        <h2 className="comparison-title">Shopify vs MellowKraft</h2>
        <p className="comparison-subtitle">
          A direct look at how platform dependence compares to a fully owned commerce architecture.
        </p>
        <div className="comparison-mobile-table-wrap">
          <table className="comparison-mobile-table">
            <thead>
              <tr>
                <th scope="col">Dimension</th>
                <th scope="col">Shopify</th>
                <th scope="col">MellowKraft</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row[0]}>
                  <th scope="row">{row[0]}</th>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ComparisonScrollSection
