/*
Copyright (c) Facebook, Inc. and its affiliates.
All rights reserved.

This source code is licensed under the BSD-style license found in the
LICENSE file in the root directory of this source tree.
*/

package main

import (
	"crypto/rand"
	"crypto/x509"
	"encoding/pem"
	"flag"
	"fmt"
	"log"
	"math/big"
	"os"
	"time"

	"magma/orc8r/cloud/go/security/cert"
	"magma/orc8r/cloud/go/security/csr"
	"magma/orc8r/cloud/go/util"
)

var (
	validFor   = flag.Duration("duration", 365, "Duration that certificate is valid for (days)")
	caCertFile = flag.String("cac", "server_cert.pem", "Signer CA's Certificate file")
	caKeyFile  = flag.String("cak", "server_cert.key.pem", "Signer CA's Private Key file")
)

const usageExamples string = `
Examples:

  Sign a CSR using signer CA's certificate and private key

	$> %s csrFile [certFile]

  If certFile is not speficied, signed certificate will be written to csrFile.cert.pem

`

func main() {
	oldUsage := flag.Usage
	flag.Usage = func() {
		oldUsage()
		cmd := os.Args[0]
		fmt.Printf(usageExamples, cmd)
	}

	flag.Parse()
	if flag.NArg() < 1 {
		flag.Usage()
		os.Exit(2)
	}
	var csrFile string
	var certFile string
	csrFile = flag.Arg(0)
	if flag.NArg() == 1 {
		certFile = csrFile + ".cert.pem"
	} else {
		certFile = flag.Arg(1)
	}

	caCert, caPrivKey, err := cert.LoadCertAndPrivKey(*caCertFile, *caKeyFile)
	if err != nil {
		log.Fatal(err)
	}

	clientCSR, err := csr.ReadCSR(csrFile)
	if err != nil {
		log.Fatal(err)
	}

	// create certificate template
	notBefore := time.Now()
	notAfter := notBefore.Add(*validFor * 24 * time.Hour)

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		log.Fatalf("Failed to generate serial number: %s", err)
	}

	template := x509.Certificate{
		SerialNumber:          serialNumber,
		Subject:               clientCSR.Subject,
		NotBefore:             notBefore,
		NotAfter:              notAfter,
		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature,
		BasicConstraintsValid: true,
	}

	log.Printf("Creating Certificate for Subject: %s\n",
		util.FormatPkixSubject(&template.Subject))
	log.Printf("Using CA Subject: %s\n",
		util.FormatPkixSubject(&caCert.Subject))

	cliCertDER, err := x509.CreateCertificate(
		rand.Reader, &template, caCert, clientCSR.PublicKey, caPrivKey)

	certOut, err := os.Create(certFile)
	if err != nil {
		log.Fatalf("Failed to open %s for writing: %s", certFile, err)
	}
	pem.Encode(certOut, &pem.Block{Type: "CERTIFICATE", Bytes: cliCertDER})
	certOut.Close()
	log.Printf("Certificate written %s\n", certFile)
}
